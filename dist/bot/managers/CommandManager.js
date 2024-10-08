"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const fs_1 = __importDefault(require("fs"));
const Oceanic = __importStar(require("oceanic.js"));
const createInteraction_js_1 = require("../models/createInteraction.js");
const createCommand_js_1 = require("../models/createCommand.js");
class CommandManager {
    commands = [];
    interactions = [];
    internalCacheAutocomplete = new Map();
    client;
    constructor(client) {
        this.client = client;
    }
    loadInteraction(imports) {
        for (const i of Object.values(imports)) {
            if (i instanceof createInteraction_js_1.InternalInteraction) {
                this.interactions.push(i.data);
            }
        }
    }
    async loadArgumentsFromCommands(commands, baseName = '') {
        for (const anyCommand of commands) {
            if (anyCommand.type === 'command') {
                for (const arg of Object.values(anyCommand.args || {})) { // Adicionada verificação para evitar null/undefined
                    if (!arg.autocomplete) continue;
                    this.internalCacheAutocomplete.set(`${baseName ? `${baseName} ${anyCommand.name}` : anyCommand.name} ${arg.name}`, arg.autocomplete);
                }
            } else {
                await this.loadArgumentsFromCommands(anyCommand.commands || [], `${baseName} ${anyCommand.name}`); // Adicionada verificação
            }
        }
    }
    async loadCommand(dir, internal_group) {
        let group = internal_group;
        const readdir = fs_1.default.readdirSync(dir);
        const index = readdir.find((i) => i.startsWith('index'));
        if (index) {
            readdir.splice(readdir.indexOf(index), 1);
            group = (await Promise.resolve(`${`${dir}/index.js`}`).then(s => __importStar(require(s)))).default;
            if (!internal_group) {
                this.commands.push(group);
            } else {
                internal_group.commands.push(group);
            }
        }
        for (const file of readdir) {
            const stats = fs_1.default.statSync(`${dir}/${file}`);
            if (stats.isDirectory()) {
                await this.loadCommand(`${dir}/${file}`, group);
            } else {
                const imports = await Promise.resolve(`${`${dir}/${file}`}`).then(s => __importStar(require(s)));
                const command = imports.default;
                if (group) {
                    group.commands.push(command);
                } else {
                    this.commands.push(command);
                }
                this.loadInteraction(imports);
            }
        }
    }
    getCommand(name) {
        let command = this.commands.find((i) => i.name === name[0]);
        while (command?.type === 'group') {
            name.shift();
            command = command.commands.find((i) => i.name === name[0]);
        }
        return command;
    }
    createCommandArgs(values, command, interaction) {
        const data = {};
        for (const value of values) {
            const key = String(Object.entries(command.args).find((data) => {
                return data[1].name === value.name;
            })?.[0]);
            switch (value.type) {
                case Oceanic.ApplicationCommandOptionTypes.USER: {
                    data[key] = interaction.data.resolved.users.get(value.value);
                    break;
                }
                default:
                    data[key] = value.value;
            }
        }
        return data;
    }
    async runInteraction(data) {
        const args = data.data.custom_id.split(';');
        const interaction = this.interactions.find((i) => i.name === args[0]);
        if (!interaction) return;
        const component = new Oceanic.ComponentInteraction(data, this.client);
        if (component.data.componentType === 2 || component.data.componentType === 3) {
            interaction.run(new createInteraction_js_1.InteractionContext(component));
        }
    }
    async runCommand(data, reply) {
        const i = new Oceanic.CommandInteraction(data, this.client);
        const content = [i.data.name].concat(i.data.options.getSubCommand() || []);
        const command = this.getCommand(content);
        if (!command) return;
        const ctx = new createCommand_js_1.CommandContext(i);
        const values = i.data.options.getOptions();
        ctx.args = this.createCommandArgs(values, command, i);
        command.run(ctx);
    }
    async runModalSubmit(data) {
        const i = new Oceanic.ModalSubmitInteraction(data, this.client);
        const args = data.data.custom_id.split(';');
        const interaction = this.interactions.find((i) => i.name === args[0]);
        if (!interaction) return;
        interaction.run(new createInteraction_js_1.InteractionContext(i));
    }
    async runAutoComplete(data) {
        const i = new Oceanic.AutocompleteInteraction(data, this.client);
        const focused = [i.data.name]
            .concat(i.data.options.getSubCommand() || [], i.data.options.getFocused()?.name || [])
            .join(' ');
        const autocomplete = this.internalCacheAutocomplete.get(focused);
        if (autocomplete) autocomplete(i);
    }
}
exports.CommandManager = CommandManager;
