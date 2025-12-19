"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxFactory = void 0;
const sandbox_1 = require("./sandbox");
class SandboxFactory {
    constructor() {
        this.factories = new Map();
        this.factories.set('local', (config) => new sandbox_1.LocalSandbox(config));
    }
    register(kind, factory) {
        this.factories.set(kind, factory);
    }
    create(config) {
        const factory = this.factories.get(config.kind);
        if (!factory) {
            throw new Error(`Sandbox factory not registered: ${config.kind}`);
        }
        return factory(config);
    }
}
exports.SandboxFactory = SandboxFactory;
