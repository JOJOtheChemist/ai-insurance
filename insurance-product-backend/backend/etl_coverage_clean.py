#!/usr/bin/env python3
"""
ETL 脚本: 将 insurance_product.coverage 中的文本列表清洗成结构化 JSON.
"""
import argparse
import json
import os
import re
from typing import Dict, Any, List

import psycopg2
from psycopg2.extras import RealDictCursor, Json


SEMANTIC_PATTERNS = [
    re.compile(r"(?:给付|赔付)([^，。；：]*?(?:保险金|年金|满期金|保费|津贴|费用补偿金|费用|补偿金|理赔金))"),
    re.compile(r"([^，。；：]*?(?:保险金|年金|满期金|保费|津贴|费用补偿金|费用|补偿金|理赔金))"),
]


DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "database": os.getenv("DB_NAME", "insurance_products"),
    "user": os.getenv("DB_USER", "yeya"),
    "password": os.getenv("DB_PASSWORD", ""),
    "port": int(os.getenv("DB_PORT", 5432)),
}


def _extract_semantic_key(clean_text: str) -> str:
    """没有冒号时尝试根据句子语义提取条款名称."""
    for pattern in SEMANTIC_PATTERNS:
        match = pattern.search(clean_text)
        if not match:
            continue
        candidate = match.group(1).strip()
        if not candidate:
            continue
        # 若出现“或/以及”之类的连接词，只取第一项
        candidate = re.split(r"[或、/以及]", candidate)[0].strip()
        candidate = candidate.strip("，。；： ")
        if len(candidate) >= 2:
            return candidate
    return ""


def parse_coverage(raw_coverage_json: str) -> Dict[str, Any]:
    """
    将 coverage 列表转换为 KV 字典.
    """
    if not raw_coverage_json:
        return {}

    try:
        items: List[str] = json.loads(raw_coverage_json)
        structured_data: Dict[str, Any] = {}

        for item in items:
            if not isinstance(item, str):
                # 将异常内容直接序列化
                structured_data[f"clause_{len(structured_data) + 1}"] = json.dumps(
                    item, ensure_ascii=False
                )
                continue

            clean_text = re.sub(r"^[•\-\s]+", "", item)
            match = re.search(r"[：:]", clean_text)

            key = ""
            value = clean_text

            if match:
                key = clean_text[: match.start()].strip()
                value = clean_text[match.end() :].strip()

            if not key:
                key = _extract_semantic_key(clean_text)

            if not key:
                key = f"clause_{len(structured_data) + 1}"

            structured_data[key] = value or clean_text

        return structured_data

    except Exception as exc:  # pylint: disable=broad-except
        print(f"[WARN] JSON parse error: {exc}")
        return {"raw": raw_coverage_json}


def ensure_backup_columns(cursor) -> None:
    """确保备份列/结构化列存在."""
    cursor.execute(
        """
        ALTER TABLE insurance_product
        ADD COLUMN IF NOT EXISTS coverage_raw_backup TEXT;
        """
    )
    cursor.execute(
        """
        ALTER TABLE insurance_product
        ADD COLUMN IF NOT EXISTS coverage_structured JSONB;
        """
    )


def backup_original_coverage(cursor) -> int:
    """拷贝 coverage 原始内容到备份列."""
    cursor.execute(
        """
        UPDATE insurance_product
        SET coverage_raw_backup = coverage
        WHERE coverage_raw_backup IS NULL AND coverage IS NOT NULL;
        """
    )
    return cursor.rowcount


def fetch_rows(cursor, limit: int = 0):
    """读取需要处理的行."""
    sql = """
        SELECT id, coverage, coverage_raw_backup, coverage_structured
        FROM insurance_product
        WHERE coverage IS NOT NULL
        ORDER BY id
    """
    params = []
    if limit:
        sql += " LIMIT %s"
        params.append(limit)

    cursor.execute(sql, params)
    return cursor.fetchall()


def process_rows(cursor, rows, dry_run: bool = False) -> int:
    """清洗数据并更新 coverage_structured."""
    updated = 0
    for row in rows:
        raw_source = row.get("coverage_raw_backup") or row.get("coverage")
        if not raw_source:
            continue

        structured = parse_coverage(raw_source)
        if dry_run:
            print(
                f"[DRY-RUN] id={row['id']} clauses={len(structured)} "
                f"sample={list(structured.keys())[:3]}"
            )
            continue

        cursor.execute(
            """
            UPDATE insurance_product
            SET coverage_structured = %s,
                update_time = NOW()
            WHERE id = %s;
            """,
            (Json(structured), row["id"]),
        )
        updated += 1

    return updated


def main():
    parser = argparse.ArgumentParser(
        description="Clean insurance_product.coverage into structured JSON."
    )
    parser.add_argument("--limit", type=int, default=0, help="限制处理的记录数量")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="仅打印将要处理的数据，不写入数据库",
    )
    args = parser.parse_args()

    conn = psycopg2.connect(**DB_CONFIG)
    try:
        conn.autocommit = False
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        ensure_backup_columns(cursor)
        backed_up = backup_original_coverage(cursor)
        if backed_up:
            print(f"[INFO] Backed up {backed_up} rows into coverage_raw_backup.")

        rows = fetch_rows(cursor, args.limit)
        if not rows:
            print("[INFO] No rows with coverage found.")
            conn.commit()
            return

        updated = process_rows(cursor, rows, dry_run=args.dry_run)
        if args.dry_run:
            conn.rollback()
            print(f"[INFO] Dry-run completed for {len(rows)} rows.")
        else:
            conn.commit()
            print(f"[INFO] Updated {updated} rows.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
