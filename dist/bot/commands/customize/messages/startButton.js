"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oceanic_js_1 = require("oceanic.js");
const createCommand_1 = require("../../../models/createCommand");
const Customizations_1 = require("../../../utils/Customizations");
const Embed_1 = require("../../../structure/builders/Embed");
const env_1 = require("../../../../env");
exports.default = (0, createCommand_1.createCommand)({
    name: 'iniciar',
    description: 'Customize o emoji do botão "iniciar" dos confrontos',
    type: 'command',
    args: {
        message: {
            name: 'emoji',
            type: oceanic_js_1.ApplicationCommandOptionTypes.STRING,
            description: 'Emoji para o botão de "iniciar"',
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
        const emoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g.test(message)
            ? message
            : {
                id: message?.replace(/[\<,\>]/g, '')?.split(':')[2],
                name: message?.replace(/[\<,\>]/g, '')?.split(':')[1],
            };
        (0, Customizations_1.setCustoms)(String(ctx.data.guildID), {
            messages: {
                ...customs.messages,
                dailyEmbedStartButtonEmoji: emoji,
            },
        });
        ctx.data.reply({
            content: 'Emoji atualizado!',
            embeds: [
                new Embed_1.Embed()
                    .setDescription(`${customs.messages?.dailyEmbedStartButtonEmoji
                    ? `> Antigo: ${typeof customs.messages
                        .dailyEmbedStartButtonEmoji ==
                        'string'
                        ? customs.messages
                            .dailyEmbedStartButtonEmoji
                        : `<:${customs.messages.dailyEmbedStartButtonEmoji.name}:${customs.messages.dailyEmbedStartButtonEmoji.id}>`}`
                    : ''}\n> Novo: ${typeof emoji == 'string'
                    ? emoji
                    : `<:${emoji.name}:${emoji.id}>`}`)
                    .setColorHex('#ff4343'),
            ],
            flags: 64,
        });
    },
});

exports.ranking = (0, createCommand_1.createCommand)({
    name: 'ranking',
    description: 'Mostra o ranking dos jogadores.',
    type: 'command',
    run: async (ctx) => {
        const rankingData = require("../../../data/ranking.json");
        const rankingEmbed = new Embed_1.Embed()
            .setTitle("Ranking dos Jogadores")
            .setColorHex("#00ff00");

        if (rankingData.length === 0) {
            rankingEmbed.setDescription("Nenhum jogador no ranking.");
        } else {
            rankingData.sort((a, b) => b.points - a.points);
            const rankingList = rankingData.map((player, index) => {
                return `${index + 1}. ${player.name} - ${player.points} pontos`;
            }).join("\n");
            rankingEmbed.setDescription(rankingList);
        }

        ctx.data.reply({
            embeds: [rankingEmbed],
        });
    },
});
