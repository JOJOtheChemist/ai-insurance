"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const insurance_search_1 = require("./insurance_search");
const insurance_filter_1 = require("./insurance_filter");
const insurance_inspect_1 = require("./insurance_inspect");
async function verifyTools() {
    console.log("=== SDK Tools Comprehensive Test Suite ===\n");
    // ==========================================
    // 1. Filter Tool Tests
    // ==========================================
    console.log("--- [Filter Tool Tests] ---");
    const filterTests = [
        { name: "Child Medical (Age 5)", params: { age_min: 5, age_max: 5, product_type: '医疗险' } },
        { name: "Senior Accident (Age 65)", params: { age_min: 65, age_max: 65, product_type: '意外险' } },
        { name: "Adult Critical Illness (Age 30)", params: { age_min: 30, age_max: 30, product_type: '重疾险' } },
        { name: "Term Life (Age 40)", params: { age_min: 40, age_max: 40, product_type: '定期寿险' } }
    ];
    for (const t of filterTests) {
        try {
            process.stdout.write(`Testing ${t.name}... `);
            const res = await insurance_filter_1.InsuranceFilter.exec(t.params);
            if (res.ok && res.count >= 0) {
                console.log(`[PASS] Count: ${res.count}`);
                if (res.count > 0 && res.products) {
                    // Show first match name
                    console.log(`    First match: ${res.products[0].product_name} (${res.products[0].age_range})`);
                }
            }
            else {
                console.log(`[FAIL] ${JSON.stringify(res)}`);
            }
        }
        catch (e) {
            console.log(`[ERROR] ${e}`);
        }
    }
    // ==========================================
    // 2. Search Tool Tests
    // ==========================================
    console.log("\n--- [Search Tool Tests] ---");
    const searchTests = [
        { name: "Disease '癌症' (Cancer)", keyword: "癌症", expect: "重疾险" },
        { name: "Accident '骨折' (Fracture)", keyword: "骨折", expect: "意外" },
        { name: "Coverage '猝死' (Sudden Death)", keyword: "猝死", expect: "意外" },
        { name: "Specific '阿尔茨海默' (Alzheimer)", keyword: "阿尔茨海默", expect: "重疾" },
        { name: "Hospital '门急诊' (Outpatient)", keyword: "门急诊", expect: "医疗" }
    ];
    for (const t of searchTests) {
        try {
            process.stdout.write(`Testing ${t.name}... `);
            const res = await insurance_search_1.InsuranceSearch.exec({ keyword: t.keyword, limit: 3 });
            if (res.ok && res.products && res.products.length > 0) {
                console.log(`[PASS] Found ${res.products.length} items`);
                res.products.forEach((p, idx) => {
                    console.log(`    #${idx + 1}: ${p.product_name} (Score: ${p.score})`);
                    // If snippet exists, show it briefly
                    if (p.matches?.coverage)
                        console.log(`      Snippet: ${p.matches.coverage.substring(0, 60)}...`);
                    if (p.matches?.extend_info)
                        console.log(`      Extend: ${p.matches.extend_info.substring(0, 60)}...`);
                });
            }
            else {
                console.log(`[WARN] No results found.`);
            }
        }
        catch (e) {
            console.log(`[ERROR] ${e}`);
        }
    }
    // ==========================================
    // 3. Inspect Tool Tests
    // ==========================================
    console.log("\n--- [Inspect Tool Tests] ---");
    // We need valid IDs. Let's use ID 43 (Child Medical), ID 33 (Critical), ID 40 (Accident)
    const inspectTests = [
        { name: "Inspect ID 43 (Keys)", params: { product_id: 43, fields: "coverage,extend_info", view: "summary" } },
        { name: "Inspect ID 33 (Details)", params: { product_id: 33, fields: "product_name,product_type", view: "full" } },
        { name: "Inspect ID 40 (Coverage Drill)", params: { product_id: 40, fields: "coverage", view: "summary" } }
    ];
    for (const t of inspectTests) {
        try {
            process.stdout.write(`Testing ${t.name}... `);
            const res = await insurance_inspect_1.InsuranceInspect.exec(t.params);
            if (res.ok && res.data) {
                console.log(`[PASS]`);
                console.log(`    Result: ${JSON.stringify(res.data)}`);
            }
            else {
                console.log(`[FAIL] ${JSON.stringify(res)}`);
            }
        }
        catch (e) {
            console.log(`[ERROR] ${e}`);
        }
    }
}
// Check if TS-Node is running or just standard node
verifyTools().then(() => console.log("\nDone."));
