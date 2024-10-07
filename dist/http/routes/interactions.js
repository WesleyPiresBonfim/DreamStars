"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route_interaction = void 0;
const discord_interactions_1 = require("discord-interactions");
const env_js_1 = require("../../env.js");
const v10_1 = require("discord-api-types/v10");
const Client_js_1 = require("../../bot/structure/Client.js");
const route_interaction = async (fastify) => {
    fastify.addHook('preHandler', (req, reply, done) => {
        const signature = req.headers['x-signature-ed25519'];
        const timestamp = req.headers['x-signature-timestamp'];
        const isVerified = (0, discord_interactions_1.verifyKey)(JSON.stringify(req.body), signature, timestamp, env_js_1.enhancer.env.PUBLIC_KEY);
        if (!isVerified)
            return reply.code(401).send('Bad request signature');
        done();
    });
    fastify.post('/interactions', (req, reply) => {
        const data = req.body;
        if (data.type == 1)
            return reply.send({ type: 1 });
        else if (data.type == v10_1.InteractionType.ApplicationCommand) {
            Client_js_1.bot.command.runCommand(data, reply);
        }
        else if (data.type == v10_1.InteractionType.MessageComponent) {
            Client_js_1.bot.command.runInteraction(data);
        }
        else if (data.type == v10_1.InteractionType.ApplicationCommandAutocomplete) {
            Client_js_1.bot.command.runAutoComplete(data);
        }
        else if (data.type == v10_1.InteractionType.ModalSubmit) {
            Client_js_1.bot.command.runModalSubmit(data);
        }
    });
};
exports.route_interaction = route_interaction;
