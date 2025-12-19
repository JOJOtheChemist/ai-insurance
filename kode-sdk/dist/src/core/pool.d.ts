import { Agent, AgentConfig, AgentDependencies } from './agent';
import { AgentStatus, SnapshotId } from './types';
export interface AgentPoolOptions {
    dependencies: AgentDependencies;
    maxAgents?: number;
}
export declare class AgentPool {
    private agents;
    private deps;
    private maxAgents;
    constructor(opts: AgentPoolOptions);
    create(agentId: string, config: AgentConfig): Promise<Agent>;
    get(agentId: string): Agent | undefined;
    list(opts?: {
        prefix?: string;
    }): string[];
    status(agentId: string): Promise<AgentStatus | undefined>;
    fork(agentId: string, snapshotSel?: SnapshotId | {
        at?: string;
    }): Promise<Agent>;
    resume(agentId: string, config: AgentConfig, opts?: {
        autoRun?: boolean;
        strategy?: 'crash' | 'manual';
    }): Promise<Agent>;
    resumeAll(configFactory: (agentId: string) => AgentConfig, opts?: {
        autoRun?: boolean;
        strategy?: 'crash' | 'manual';
    }): Promise<Agent[]>;
    delete(agentId: string): Promise<void>;
    size(): number;
}
