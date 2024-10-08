"use strict";

const Client = require("./bot/structure/Client.js");
const fastify = require("fastify")({ logger: true });
const dotenv = require("dotenv");

// Carregar o arquivo .env
dotenv.config();

// Verifique se o token está definido
if (!process.env.TOKEN) {
    console.error("Erro: O token do bot não está definido. Verifique o arquivo .env");
    process.exit(1);
}

// Inicie o Fastify e defina um endpoint simples
fastify.get("/", async (request, reply) => {
    return { hello: "world" };
});

fastify.listen(3000, "0.0.0.0", (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server is running on ${address}`);
});

// Carregar e conectar o bot
Client.bot.load().then(() => {
    console.log("Bot carregado com sucesso!");
    Client.bot.connect().then(() => {
        console.log("Bot conectado!");
    }).catch((err) => {
        console.error("Erro ao conectar o bot:", err);
    });
}).catch((err) => {
    console.error("Erro ao carregar o bot:", err);
});
