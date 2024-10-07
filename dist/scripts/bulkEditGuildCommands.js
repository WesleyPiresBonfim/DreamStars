"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../bot/structure/Client");
const Logging_1 = require("../modules/Logging");
require("../index");
const initTime = Date.now();
Client_1.bot.on('ready', () => {
    Client_1.bot.bulkEditGuildCommands('1152751704748601415').then(() => {
        (0, Logging_1.log)(`Bulk editing of commands ${'(guild)'.gray} completed successfully in ${((Date.now() - initTime) /
            1000).toFixed(2)} seconds`, ['bot:bulkEditGlobalCommands'.magenta]);
    });
});
