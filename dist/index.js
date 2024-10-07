"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logging_1 = require("./modules/Logging");
const server_1 = require("./http/server");
const env_1 = require("./env");
const Client_1 = require("./bot/structure/Client");
(async () => {
    if (env_1.enhancer.env.NAME != 'production')
        (0, Logging_1.warn)(`Environment: ${env_1.enhancer.env.NAME.magenta}`, [
            'app:environment'.blue,
        ]);
    Client_1.bot.load();
    Client_1.bot.on('ready', () => {
        (0, Logging_1.log)('Bot is now ' + 'Ready'.magenta + '!', [
            'bot:gatewayConnection'.blue,
        ]);
        if (env_1.enhancer.env.NAME == 'production') {
            Client_1.bot.bulkEditGlobalCommands();
        }
    });
    server_1.app.listen({ host: '0.0.0.0', port: env_1.enhancer.env.PORT }).then((i) => {
        (0, Logging_1.log)('Server is running', ['fastify:server'.green]);
    });
})();
