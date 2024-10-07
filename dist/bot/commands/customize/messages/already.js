"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oceanic_js_1 = require("oceanic.js");
const createCommand_1 = require("../../../models/createCommand");
const Customizations_1 = require("../../../utils/Customizations");
const Embed_1 = require("../../../structure/builders/Embed");
const env_1 = require("../../../../env");
exports.default = (0, createCommand_1.createCommand)({
    name: 'inscrito',
    description: 'Customize a mensagem de quando um jogador já está inscrito',
    type: 'command',
    args: {
        message: {
            name: 'mensagem',
            type: oceanic_js_1.ApplicationCommandOptionTypes.STRING,
            description: 'Mensagem de aviso',
            required: true,
        },
    },
    run: async (ctx) => {
        const customs = (0, Customizations_1.getCustoms)(String(ctx.data.guildID));
        const message = ctx.args.message;
        if (!(env_1.enhancer.env.DEVS_ID.split(',').includes(ctx.data.user.id) ||
            ctx.data.member?.roles.includes(String(customs.clashesManagerRoleID)))) {
            return ctx.data.reply({
                content: 'Você não tem permissão para customizar.',
                flags: 64,
            });
        }
        (0, Customizations_1.setCustoms)(String(ctx.data.guildID), {
            messages: {
                ...customs.messages,
                alreadySubscribed: message,
            },
        });
        ctx.data.reply({
            content: 'Mensagem atualizada!',
            embeds: [
                new Embed_1.Embed()
                    .setDescription(`${customs.messages?.unauthorizedToRunDaily
                    ? `> Antiga: \`\`\`${customs.messages?.unauthorizedToRunDaily}\`\`\``
                    : ''}\n> Nova: \`\`\`${message}\`\`\``)
                    .setColorHex('#ff4343'),
            ],
            flags: 64,
        });
    },
});
