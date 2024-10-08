"use strict";

const { Client: OceanicClient } = require("oceanic.js");
const path = require("path");
const fs = require("fs");

class Client extends OceanicClient {
    constructor(options) {
        super({
            auth: process.env.TOKEN,  // Use o token do .env
            gateway: {
                intents: [
                    "GUILDS",
                    "GUILD_MESSAGES",
                    "MESSAGE_CONTENT",
                ]
            }
        });

        this.commands = [];
        this.slashCommands = [];
    }

    // Método para carregar todos os comandos
    async load() {
        try {
            const commandPath = path.join(__dirname, "../commands");
            const files = fs.readdirSync(commandPath);

            for (const file of files) {
                const command = require(path.join(commandPath, file));
                this.commands.push(command);
                console.log(`Comando ${command.name} carregado com sucesso!`);
            }

            this.mappingSlash();
            await this.bulkEditGlobalCommands();
        } catch (err) {
            console.error("Erro ao carregar comandos:", err);
        }
    }

    // Mapeia os comandos em formato de slash commands
    mappingSlash() {
        this.slashCommands = this.commands.map((command) => ({
            name: command.name,
            description: command.description,
            options: command.args ? Object.values(command.args).map((arg) => ({
                name: arg.name,
                description: arg.description,
                type: arg.type,
                required: arg.required || false,
            })) : []
        }));
    }

    // Adiciona os comandos de barra globais para o bot
    async bulkEditGlobalCommands() {
        try {
            const commands = await this.application.bulkEditGlobalCommands(this.slashCommands);
            console.log("Comandos globais registrados: ", commands);
        } catch (err) {
            console.error("Erro ao registrar comandos globais:", err);
        }
    }
}

// Exporta a instância do bot
module.exports = { bot: new Client() };
