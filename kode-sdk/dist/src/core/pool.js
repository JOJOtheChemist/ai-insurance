"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentPool = void 0;
const agent_1 = require("./agent");
class AgentPool {
    constructor(opts) {
        this.agents = new Map();
        this.deps = opts.dependencies;
        this.maxAgents = opts.maxAgents || 50;
    }
    async create(agentId, config) {
        if (this.agents.has(agentId)) {
            throw new Error(`Agent already exists: ${agentId}`);
        }
        if (this.agents.size >= this.maxAgents) {
            throw new Error(`Pool is full (max ${this.maxAgents} agents)`);
        }
        const agent = await agent_1.Agent.create({ ...config, agentId }, this.deps);
        this.agents.set(agentId, agent);
        return agent;
    }
    get(agentId) {
        return this.agents.get(agentId);
    }
    list(opts) {
        const ids = Array.from(this.agents.keys());
        return opts?.prefix ? ids.filter((id) => id.startsWith(opts.prefix)) : ids;
    }
    async status(agentId) {
        const agent = this.agents.get(agentId);
        return agent ? await agent.status() : undefined;
    }
    async fork(agentId, snapshotSel) {
        const agent = this.agents.get(agentId);
        if (!agent) {
            throw new Error(`Agent not found: ${agentId}`);
        }
        return agent.fork(snapshotSel);
    }
    async resume(agentId, config, opts) {
        // 1. Check if already in pool
        if (this.agents.has(agentId)) {
            return this.agents.get(agentId);
        }
        // 2. Check pool capacity
        if (this.agents.size >= this.maxAgents) {
            throw new Error(`Pool is full (max ${this.maxAgents} agents)`);
        }
        // 3. Verify session exists
        const exists = await this.deps.store.exists(agentId);
        if (!exists) {
            throw new Error(`Agent not found in store: ${agentId}`);
        }
        // 4. Use Agent.resume() to restore
        const agent = await agent_1.Agent.resume(agentId, { ...config, agentId }, this.deps, opts);
        // 5. Add to pool
        this.agents.set(agentId, agent);
        return agent;
    }
    async resumeAll(configFactory, opts) {
        const agentIds = await this.deps.store.list();
        const resumed = [];
        for (const agentId of agentIds) {
            if (this.agents.size >= this.maxAgents)
                break;
            if (this.agents.has(agentId))
                continue;
            try {
                const config = configFactory(agentId);
                const agent = await this.resume(agentId, config, opts);
                resumed.push(agent);
            }
            catch (error) {
                console.error(`Failed to resume ${agentId}:`, error);
            }
        }
        return resumed;
    }
    async delete(agentId) {
        this.agents.delete(agentId);
        await this.deps.store.delete(agentId);
    }
    size() {
        return this.agents.size;
    }
}
exports.AgentPool = AgentPool;
