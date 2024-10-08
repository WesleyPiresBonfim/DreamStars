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
exports.Client = void 0;
const Oceanic = __importStar(require("oceanic.js"));
const CommandManager_js_1 = require("../managers/CommandManager.js");
const createInteraction_js_1 = require("../models/createInteraction.js");

class Client extends Oceanic.Client {
    commandManager;

    constructor(options) {
        super(options);
        this.commandManager = new CommandManager_js_1.CommandManager(this);
        this.once("ready", () => {
            this.bulkEditGlobalCommands();
        });
    }

    async bulkEditGlobalCommands() {
        const commands = this.commandManager.commands.filter(command => command.type === "command");
        const data = commands.map(command => {
            const args = command.args ? Object.values(command.args).map(arg => {
                return {
                    name: arg.name,
                    description: arg.description,
                    type: arg.type,
                    required: arg.required || false,
                    choices: arg.choices || [],
                    options: arg.options || []
                };
            }) : [];

            return {
                name: command.name,
                description: command.description,
                type: Oceanic.ApplicationCommandTypes.CHAT_INPUT,
                options: args
            };
        });

        try {
            await this.rest.put(Oceanic.Routes.applicationCommands(this.user.id), { body: data });
            console.log("Comandos registrados com sucesso!");
        } catch (error) {
            console.error("Falha ao registrar comandos:", error);
        }
    }

    async mappingSlash() {
        for (const i of this.commandManager.commands) {
            if (i.type === "command") {
                if (i.args) {
                    Object.values(i.args).map((arg) => {
                        // Aqui você pode fazer algo com os argumentos, se necessário
                    });
                }
            }
        }
    }
}

exports.Client = Client;
