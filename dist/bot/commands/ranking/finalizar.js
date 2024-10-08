"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oceanic_js_1 = require("oceanic.js");
const createCommand_1 = require("../../models/createCommand");
const fs = require("fs");
const path = require("path");
const env_1 = require("../../../env");

const rankingFilePath = path.join(__dirname, "../../../ranking.json");

// Função para carregar o ranking
const loadRanking = () => {
    if (fs.existsSync(rankingFilePath)) {
        const data = fs.readFileSync(rankingFilePath);
        return JSON.parse(data);
    }
    return [];
};

// Função para salvar o ranking
const saveRanking = (ranking) => {
    fs.writeFileSync(rankingFilePath, JSON.stringify(ranking, null, 2));
};

exports.default = (0, createCommand_1.createCommand)({
    name: "finalizar",
    description: "Finaliza o diário com pontos, vencedor e organizador.",
    type: "command",
    args: {
        pontos: {
            name: "pontos",
            type: oceanic_js_1.ApplicationCommandOptionTypes.INTEGER,
            description: "Quantidade de pontos",
            required: true,
        },
        vencedor: {
            name: "vencedor",
            type: oceanic_js_1.ApplicationCommandOptionTypes.STRING,
            description: "ID do vencedor",
            required: true,
        },
        organizador: {
            name: "organizador",
            type: oceanic_js_1.ApplicationCommandOptionTypes.STRING,
            description: "ID do organizador",
            required: true,
        },
    },
    run: async (ctx) => {
        const pontos = ctx.args.pontos;
        const vencedor = ctx.args.vencedor;
        const organizador = ctx.args.organizador;

        // Carregar o ranking atual
        const ranking = loadRanking();

        // Adicionar nova entrada ao ranking
        ranking.push({
            pontos,
            vencedor,
            organizador,
            data: new Date().toISOString(),
        });

        // Salvar o ranking atualizado
        saveRanking(ranking);

        ctx.data.reply({
            content: "Diário finalizado com sucesso!",
            flags: 64,
        });
    },
});
