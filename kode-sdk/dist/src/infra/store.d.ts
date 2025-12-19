import { Message, Timeline, Snapshot, AgentInfo, ToolCallRecord, Bookmark, AgentChannel } from '../core/types';
import { TodoSnapshot } from '../core/todo';
export interface HistoryWindow {
    id: string;
    messages: Message[];
    events: Timeline[];
    stats: {
        messageCount: number;
        tokenCount: number;
        eventCount: number;
    };
    timestamp: number;
}
export interface CompressionRecord {
    id: string;
    windowId: string;
    config: {
        model: string;
        prompt: string;
        threshold: number;
    };
    summary: string;
    ratio: number;
    recoveredFiles: string[];
    timestamp: number;
}
export interface RecoveredFile {
    path: string;
    content: string;
    mtime: number;
    timestamp: number;
}
/**
 * Store 接口定义 Agent 持久化的所有能力
 *
 * 设计原则：
 * 1. 所有方法都是必需的，不使用可选方法
 * 2. 职责清晰：运行时状态、历史管理、事件流、元数据管理
 * 3. 实现无关：接口不暴露存储细节（如 WAL、文件格式等）
 */
export interface Store {
    /** 保存对话消息 */
    saveMessages(agentId: string, messages: Message[]): Promise<void>;
    /** 加载对话消息 */
    loadMessages(agentId: string): Promise<Message[]>;
    /** 保存工具调用记录 */
    saveToolCallRecords(agentId: string, records: ToolCallRecord[]): Promise<void>;
    /** 加载工具调用记录 */
    loadToolCallRecords(agentId: string): Promise<ToolCallRecord[]>;
    /** 保存 Todo 快照 */
    saveTodos(agentId: string, snapshot: TodoSnapshot): Promise<void>;
    /** 加载 Todo 快照 */
    loadTodos(agentId: string): Promise<TodoSnapshot | undefined>;
    /** 追加事件到流中 */
    appendEvent(agentId: string, timeline: Timeline): Promise<void>;
    /** 读取事件流（支持 Bookmark 续读和 Channel 过滤） */
    readEvents(agentId: string, opts?: {
        since?: Bookmark;
        channel?: AgentChannel;
    }): AsyncIterable<Timeline>;
    /** 保存历史窗口（压缩前的完整快照） */
    saveHistoryWindow(agentId: string, window: HistoryWindow): Promise<void>;
    /** 加载所有历史窗口 */
    loadHistoryWindows(agentId: string): Promise<HistoryWindow[]>;
    /** 保存压缩记录 */
    saveCompressionRecord(agentId: string, record: CompressionRecord): Promise<void>;
    /** 加载所有压缩记录 */
    loadCompressionRecords(agentId: string): Promise<CompressionRecord[]>;
    /** 保存恢复文件快照 */
    saveRecoveredFile(agentId: string, file: RecoveredFile): Promise<void>;
    /** 加载所有恢复文件 */
    loadRecoveredFiles(agentId: string): Promise<RecoveredFile[]>;
    /** 保存快照 */
    saveSnapshot(agentId: string, snapshot: Snapshot): Promise<void>;
    /** 加载指定快照 */
    loadSnapshot(agentId: string, snapshotId: string): Promise<Snapshot | undefined>;
    /** 列出所有快照 */
    listSnapshots(agentId: string): Promise<Snapshot[]>;
    /** 保存 Agent 元信息 */
    saveInfo(agentId: string, info: AgentInfo): Promise<void>;
    /** 加载 Agent 元信息 */
    loadInfo(agentId: string): Promise<AgentInfo | undefined>;
    /** 检查 Agent 是否存在 */
    exists(agentId: string): Promise<boolean>;
    /** 删除 Agent 所有数据 */
    delete(agentId: string): Promise<void>;
    /** 列出所有 Agent ID */
    list(prefix?: string): Promise<string[]>;
}
export declare class JSONStore implements Store {
    private baseDir;
    private flushIntervalMs;
    private eventWriters;
    private walQueue;
    private walRecovered;
    constructor(baseDir: string, flushIntervalMs?: number);
    private getAgentDir;
    private getRuntimePath;
    private getEventsPath;
    private getHistoryDir;
    private getSnapshotsDir;
    private getMetaPath;
    saveMessages(agentId: string, messages: Message[]): Promise<void>;
    loadMessages(agentId: string): Promise<Message[]>;
    saveToolCallRecords(agentId: string, records: ToolCallRecord[]): Promise<void>;
    loadToolCallRecords(agentId: string): Promise<ToolCallRecord[]>;
    saveTodos(agentId: string, snapshot: TodoSnapshot): Promise<void>;
    loadTodos(agentId: string): Promise<TodoSnapshot | undefined>;
    private saveWithWal;
    private loadWithWal;
    private queueWalWrite;
    /**
     * Store 初始化时主动恢复所有 WAL 文件
     */
    private recoverAllWALs;
    /**
     * 恢复运行时数据的 WAL
     */
    private recoverRuntimeWAL;
    /**
     * 恢复事件流的 WAL
     */
    private recoverEventWALFile;
    appendEvent(agentId: string, timeline: Timeline): Promise<void>;
    readEvents(agentId: string, opts?: {
        since?: Bookmark;
        channel?: AgentChannel;
    }): AsyncIterable<Timeline>;
    private getEventWriters;
    private flushEvents;
    private recoverEventWal;
    private writeEventWal;
    saveHistoryWindow(agentId: string, window: HistoryWindow): Promise<void>;
    loadHistoryWindows(agentId: string): Promise<HistoryWindow[]>;
    saveCompressionRecord(agentId: string, record: CompressionRecord): Promise<void>;
    loadCompressionRecords(agentId: string): Promise<CompressionRecord[]>;
    saveRecoveredFile(agentId: string, file: RecoveredFile): Promise<void>;
    loadRecoveredFiles(agentId: string): Promise<RecoveredFile[]>;
    saveSnapshot(agentId: string, snapshot: Snapshot): Promise<void>;
    loadSnapshot(agentId: string, snapshotId: string): Promise<Snapshot | undefined>;
    listSnapshots(agentId: string): Promise<Snapshot[]>;
    saveInfo(agentId: string, info: AgentInfo): Promise<void>;
    loadInfo(agentId: string): Promise<AgentInfo | undefined>;
    exists(agentId: string): Promise<boolean>;
    delete(agentId: string): Promise<void>;
    list(prefix?: string): Promise<string[]>;
}
