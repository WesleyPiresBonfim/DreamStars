"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oceanic_js_1 = require("oceanic.js");
const createCommand_1 = require("../../models/createCommand");
const fs = require("fs");
const path = require("path");

const rankingFilePath = path.join(__dirname, "../../../ranking.json");

// Função para carregar o ranking
const loadRanking = () => {
    if (fs.existsSync(rankingFilePath)) {
        const data = fs.readFileSync(rankingFilePath);
        return JSON.parse(data);
    }
    return [];
};

exports.default = (0, createCommand_1.createCommand)({
    name: "ranking",
    description: "Mostra o ranking dos diários.",
    type: "command",
    run: async (ctx) => {
        const ranking = loadRanking();
        
        if (ranking.length === 0) {
            return ctx.data.reply({
                content: "Nenhuma entrada no ranking.",
                flags: 64,
            });
        }

        const rankingMessage = ranking.map((entry, index) => 
            `#${index + 1} | Vencedor: ${entry.vencedor} | Pontos: ${entry.pontos} | Organizador: ${entry.organizador} | Data: ${entry.data}`
        ).join("\n");

        ctx.data.reply({
            content: rankingMessage,
            flags: 64,
        });
    },
});
