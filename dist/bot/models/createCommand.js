"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandContext = void 0;
exports.createCommand = createCommand;
class CommandContext {
    data;
    args = {};
    constructor(data) {
        this.data = data;
    }
    async reply(content) {
        if (typeof content == "string")
            content = { content };
        return this.data.reply(content);
    }
}
exports.CommandContext = CommandContext;
function createCommand(data) {
    if (data.type == "group") {
        return {
            ...data,
            commands: []
        };
    }
    return data;
}
