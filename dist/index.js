"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logging_1 = require("./modules/Logging");
const server_1 = require("./http/server");
const env_1 = require("./env");
const Client_1 = require("./bot/structure/Client");

(async () => {
    // Log de ambiente
    if (env_1.enhancer.env.NAME != 'production') {
        (0, Logging_1.warn)(`Environment: ${env_1.enhancer.env.NAME.magenta}`, [
            'app:environment'.blue,
        ]);
    }

    // Carregar o bot
    await Client_1.bot.load();

    // Evento quando o bot estiver pronto
    Client_1.bot.on('ready', () => {
        (0, Logging_1.log)('Bot is now ' + 'Ready'.magenta + '!', [
            'bot:gatewayConnection'.blue,
        ]);

        // Sincronizar comandos globais apenas em produção
        if (env_1.enhancer.env.NAME == 'production') {
            Client_1.bot.bulkEditGlobalCommands();
        }
    });

    // Inicialização do servidor HTTP
    server_1.app.listen({ host: '0.0.0.0', port: env_1.enhancer.env.PORT }).then((i) => {
        (0, Logging_1.log)('Server is running', ['fastify:server'.green]);
    });
})();
