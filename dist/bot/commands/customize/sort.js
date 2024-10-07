"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createCommand_1 = require("../../models/createCommand");
const oceanic_js_1 = require("oceanic.js");
const Customizations_1 = require("../../utils/Customizations");
const Embed_1 = require("../../structure/builders/Embed");
const env_1 = require("../../../env");
exports.default = (0, createCommand_1.createCommand)({
    name: 'sorteio',
    description: 'Mude a ordem do sorteio dos confrontos',
    type: 'command',
    args: {
        sortOrder: {
            name: 'ordem',
            type: oceanic_js_1.ApplicationCommandOptionTypes.STRING,
            description: 'Ordem dos sorteios',
            required: true,
            choices: [
                {
                    name: 'Prioridade',
                    value: 'prioritized',
                },
                {
                    name: 'Aleatória',
                    value: 'random',
                },
                {
                    name: 'Entrada',
                    value: 'join',
                },
            ],
        },
    },
    run: async (ctx) => {
        const customs = (0, Customizations_1.getCustoms)(String(ctx.data.guildID));
        const sortOrder = ctx.args.sortOrder == 'prioritized'
            ? 1
            : ctx.args.sortOrder == 'random'
                ? 2
                : 3;
        if (!(env_1.enhancer.env.DEVS_ID.split(',').includes(ctx.data.user.id) ||
            ctx.data.member?.roles.includes(String(customs.clashesManagerRoleID)))) {
            return ctx.data.reply({
                content: 'Você não tem permissão para customizar.',
                flags: 64,
            });
        }
        (0, Customizations_1.setCustoms)(String(ctx.data.guildID), {
            functions: {
                ...(customs.functions || {}),
                sortOrder: sortOrder,
            },
        });
        ctx.data.reply({
            content: 'Ordem de sorteio atualizada!',
            embeds: [
                new Embed_1.Embed()
                    .setDescription(`> Ordem: ${sortOrder == 1
                    ? 'prioridade'
                    : ctx.args.sortOrder == 'random'
                        ? 'aleatória'
                        : 'entrada'}`)
                    .setColorHex('#ff4343'),
            ],
            flags: 64,
        });
    },
});
