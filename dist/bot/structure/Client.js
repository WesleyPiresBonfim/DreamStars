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
exports.bot = exports.Client = void 0;
const path_1 = __importDefault(require("path"));
const Oceanic = __importStar(require("oceanic.js"));
const CommandManager_js_1 = require("../managers/CommandManager.js");
const env_js_1 = require("../../env.js");

class Client extends Oceanic.Client {
    command = new CommandManager_js_1.CommandManager(this);

    constructor() {
        super({
            auth: `Bot ${env_js_1.enhancer.env.TOKEN}`,
        });
    }

    mappingSlash(commands, subcommand) {
        const command = commands.map((i) => {
            return {
                ...i,
                type: subcommand && i.type == 'group' ? 2 : 1,
                options: i.type == 'command'
                    ? Object.values(i.args).map((i) => {
                        return {
                            ...i,
                            autocomplete: i.autocomplete ? true : undefined,
                        };
                    })
                    : this.mappingSlash(i.commands, true),
            };
        });
        return command;
    }

    bulkEditGlobalCommands() {
        return this.application.bulkEditGlobalCommands(this.mappingSlash(this.command.commands));
    }

    bulkEditGuildCommands(guild) {
        return this.application.bulkEditGuildCommands(guild, this.mappingSlash(this.command.commands));
    }

    async load() {
        await this.command.loadCommand(path_1.default.resolve(__dirname, '../', 'commands'));
        await this.command.loadArgumentsFromCommands(this.command.commands);
        await this.restMode();
        return this;
    }
}

// Adicionando o método para registrar o comando "finalizar"
Client.prototype.registerCommand = function(command) {
    if (command && command.name) { // Verificação se o comando é válido
        this.command.commands.push(command); // Adiciona o comando ao gerenciador de comandos
        console.log(`Comando registrado: ${command.name}`); // Log para confirmar registro
    } else {
        console.error("Falha ao registrar comando: Comando inválido"); // Log de erro
    }
};

exports.Client = Client;
exports.bot = new Client();
