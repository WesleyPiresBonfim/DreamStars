"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interaction_sort = exports.interaction_leave = exports.interaction_play = exports.interaction_ranking = void 0;
const createCommand_1 = require("../models/createCommand");
const Button_1 = require("../structure/builders/Button");
const ActionRow_1 = require("../structure/builders/ActionRow");
const createInteraction_1 = require("../models/createInteraction");
const Data_1 = __importDefault(require("../../managers/Data"));
const env_1 = require("../../env");
const Customizations_1 = require("../utils/Customizations");

exports.default = (0, createCommand_1.createCommand)({
    name: "iniciar",
    description: "Inicia o chaveamento das partidas.",
    type: "command",
    args: {
        emoji: {
            name: "reação",
            description: "Emoji para entrar no chaveamento",
            type: 3,
            required: true,
        },
    },
    run: async (ctx) => {
        const customs = (0, Customizations_1.getCustoms)(String(ctx.data.guildID));
        if (!(env_1.enhancer.env.DEVS_ID.split(",").includes(ctx.data.user.id) ||
            ctx.data.member?.roles.includes(String(customs.clashesManagerRoleID)))) {
            ctx.data.reply({
                content: customs?.messages?.unauthorizedToRunDaily ||
                    "Você não possui permissão para executar este comando!",
                flags: 64,
            });
            return;
        }
        const emoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g.test(ctx.args.emoji)
            ? ctx.args.emoji
            : {
                id: String(ctx.args.emoji
                    ?.replace(/[\<,\>]/g, "")
                    ?.split(":")[2]),
                name: String(ctx.args.emoji
                    ?.replace(/[\<,\>]/g, "")
                    ?.split(":")[1]),
            };
        const embed = customs?.messages?.dailyEmbed;
        if (embed) {
            const message = await ctx.reply({
                content: customs.clashesMentionRoleID == ctx.data.guildID
                    ? "@everyone"
                    : `<@&${customs.clashesMentionRoleID ||
                        "1158429525504442369"}>`,
                embeds: [embed],
                components: [
                    new ActionRow_1.ActionRow()
                        .addComponent(new Button_1.Button()
                            .setID("play")
                            .setLabel("Entrar")
                            .setStyle("SUCCESS")
                            .setEmoji(emoji))
                        .addComponent(new Button_1.Button()
                            .setID("sort")
                            .setLabel("Iniciar")
                            .setStyle("SECONDARY")
                            .setEmoji(customs?.messages
                                ?.dailyEmbedStartButtonEmoji || {
                                id: "1270083651954278492",
                                name: "members",
                            })),
                ],
            });
            const messageId = (await message.getMessage()).id;
            Data_1.default.clashes.set(messageId, {
                id: messageId,
                users: [],
                emoji,
            });
        }
    },
});

exports.interaction_play = (0, createInteraction_1.createInteraction)({
    type: "button",
    name: "play",
    async run(ctx) {
        const customs = (0, Customizations_1.getCustoms)(String(ctx.data.guildID));
        const clash = Data_1.default.clashes.get(ctx.data.message.id);
        if (clash?.users.find((d) => d.id == ctx.data.user.id)) {
            return ctx.data.reply({
                content: customs?.messages?.alreadySubscribed ||
                    "Você já está inscrito neste campeonato.",
                flags: 64,
            });
        }
        if (clash) {
            clash.users.push({
                id: ctx.data.user.id,
                name: ctx.data.user.username,
                priority: customs.functions?.sortOrder == 1
                    ? ctx.data.member?.roles
                        .filter((roleID) => {
                            return customs.priorities?.find((d) => d.roleId == roleID);
                        })
                        .map((roleID) => {
                            return customs.priorities?.find((d) => d.roleId == roleID);
                        })
                        .sort((a, b) => Number(b?.priority) -
                            Number(a?.priority))[0]?.priority || 1
                    : customs.functions?.sortOrder == 2
                        ? 1
                        : clash.users.length ?? 1,
            });
            ctx.data.reply({
                content: "Entrada confirmada. ✅",
                flags: 64,
                components: [
                    new ActionRow_1.ActionRow().addComponent(new Button_1.Button()
                        .setID("leave")
                        .setLabel("Sair")
                        .setStyle("DANGER")
                        .setEmoji("🚪")),
                ],
            });
            ctx.data.editFollowup(ctx.data.message.id, {
                components: [
                    new ActionRow_1.ActionRow()
                        .addComponent(new Button_1.Button()
                            .setID("play")
                            .setLabel("Entrar")
                            .setStyle("SUCCESS")
                            .setEmoji(clash.emoji))
                        .addComponent(new Button_1.Button()
                            .setID("sort")
                            .setLabel(`Iniciar (${clash.users.length})`)
                            .setStyle("SECONDARY")
                            .setEmoji(customs?.messages
                                ?.dailyEmbedStartButtonEmoji || {
                                id: "1270083651954278492",
                                name: "members",
                            })),
                ],
            });
        }
    },
});

exports.interaction_leave = (0, createInteraction_1.createInteraction)({
    type: "button",
    name: "leave",
    async run(ctx) {
        const customs = (0, Customizations_1.getCustoms)(String(ctx.data.guildID));
        const clash = Data_1.default.clashes.get(Object(ctx.data.message.interactionMetadata)?.interactedMessageID);
        if (clash?.users) {
            clash.users = clash.users.filter((user) => user.id != ctx.data.user?.id);
            await (await ctx.data.client.rest.channels.getMessage(ctx.data.message.channelID, Object(ctx.data.message.interactionMetadata)
                ?.interactedMessageID)).edit({
                components: [
                    new ActionRow_1.ActionRow()
                        .addComponent(new Button_1.Button()
                            .setID("play")
                            .setLabel("Entrar")
                            .setStyle("SUCCESS")
                            .setEmoji(clash.emoji))
                        .addComponent(new Button_1.Button()
                            .setID("sort")
                            .setLabel(`Iniciar${clash.users.length >= 1
                                ? ` (${clash.users.length})`
                                : ""}`)
                            .setStyle("SECONDARY")
                            .setEmoji(customs?.messages
                                ?.dailyEmbedStartButtonEmoji || {
                                id: "1270083651954278492",
                                name: "members",
                            })),
                ],
            });
            ctx.data.reply({
                content: "Você saiu do campeonato. 🚪",
                flags: 64,
            });
        }
    },
});

exports.interaction_sort = (0, createInteraction_1.createInteraction)({
    type: "button",
    name: "sort",
    async run(ctx) {
        const customs = (0, Customizations_1.getCustoms)(String(ctx.data.guildID));
        if (!(env_1.enhancer.env.DEVS_ID.split(",").includes(ctx.data.user.id) ||
            ctx.data.member?.roles.includes(String(customs.clashesManagerRoleID)))) {
            ctx.data.reply({
                content: customs?.messages?.unauthorizedToRunDaily ||
                    "Você não possui permissão para iniciar um Diário.",
                flags: 64,
            });
            return;
        }
        const clash = Data_1.default.clashes.get(ctx.data.message.id);
        if (!clash) {
            return ctx.data.reply({
                content: "Este evento não existe mais!",
                flags: 64,
            });
        }
        const players = Object.entries(Object.fromEntries(clash.users.entries())).sort(customs.functions?.sortOrder == 1
            ? (a, b) => (a[1].priority || 1) - (b[1].priority || 1)
            : customs.functions?.sortOrder == 2
                ? (a, b) => (Math.random() * a[1].name.length) /
                    (Math.random() * b[1].name.length)
                : (a, b) => (b[1].priority || 1) - (a[1].priority || 1));
        let indicator = 1;
        let clashes = players
            .toReversed()
            .map((data, i, array) => {
                if (indicator == i)
                    return undefined;
                const nextItem = array[i + 1]?.[1];
                indicator = i + 1;
                return data[1].id == nextItem?.id
                    ? undefined
                    : [data[1], nextItem];
            })
            .filter((data) => data != undefined);
        const msg = await ctx.data.reply({
            content: `${customs?.messages?.dailyStart || "Iniciando o Diário!"}`,
            flags: 64,
            embeds: [
                {
                    title: "Resultado:",
                    fields: [
                        {
                            name: `🔘 ${players.map((data) => data[1].name).join(" | ")}`,
                            value: "\u200B",
                        },
                    ],
                },
            ],
        });
        Data_1.default.clashes.delete(ctx.data.message.id);
        await ctx.data.deleteMessage(msg.id);
        for (let clash of clashes) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await ctx.data.reply({
                content: `💥 ${clash[0].name} Vs ${clash[1].name}`,
                flags: 64,
                embeds: [],
            });
        }
        await ctx.data.reply({
            content: `🎉 ${players.map((data) => data[1].name).join(" | ")}`,
            flags: 64,
            embeds: [],
        });
    },
});

// Novo comando para ranking
exports.interaction_ranking = (0, createInteraction_1.createInteraction)({
    type: "command",
    name: "ranking",
    description: "Mostra o ranking dos vencedores.",
    async run(ctx) {
        const customs = (0, Customizations_1.getCustoms)(String(ctx.data.guildID));
        const rankingData = await ctx.data.getRankingData(); // Método fictício para obter dados do ranking

        if (!rankingData || rankingData.length === 0) {
            ctx.data.reply({
                content: customs?.messages?.noRanking || "Nenhum dado de ranking disponível.",
                flags: 64,
            });
            return;
        }

        const rankingEmbed = {
            title: "Ranking dos Vencedores",
            fields: rankingData.map((data, index) => ({
                name: `${index + 1}. ${data.winner}`,
                value: `Pontos: ${data.points} | Organizador: ${data.organizer}`,
            })),
        };

        ctx.data.reply({
            embeds: [rankingEmbed],
            flags: 64,
        });
    },
});
