"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oceanic_js_1 = require("oceanic.js");
const createCommand_js_1 = require("../../../models/createCommand.js");
const Embed_js_1 = require("../../../structure/builders/Embed.js");
const Customizations_1 = require("../../../utils/Customizations");
const env_1 = require("../../../../env");
exports.default = (0, createCommand_js_1.createCommand)({
    name: 'embed',
    description: 'Altere a Embed do campeonato',
    type: 'command',
    args: {
        title: {
            name: 'título',
            type: oceanic_js_1.ApplicationCommandOptionTypes.STRING,
            description: 'Título da Embed',
            required: true,
        },
        description: {
            name: 'descrição',
            type: oceanic_js_1.ApplicationCommandOptionTypes.STRING,
            description: 'Descrição da Embed',
            required: true,
        },
        image: {
            name: 'imagem',
            type: oceanic_js_1.ApplicationCommandOptionTypes.STRING,
            description: 'Imagem da Embed (Link/URL)',
        },
        color: {
            name: 'cor',
            type: oceanic_js_1.ApplicationCommandOptionTypes.STRING,
            description: 'Cor da Embed (HEX Code)',
        },
    },
    run: async (ctx) => {
        const customs = (0, Customizations_1.getCustoms)(String(ctx.data.guildID));
        if (!(env_1.enhancer.env.DEVS_ID.split(',').includes(ctx.data.user.id) ||
            ctx.data.member?.roles.includes(String(customs.clashesManagerRoleID)))) {
            return ctx.data.reply({
                content: 'Você não tem permissão para customizar.',
                flags: 64,
            });
        }
        const { title, description, image, color } = ctx.args;
        const embed = new Embed_js_1.Embed()
            .setTitle(title)
            .setDescription(description)
            .setColorHex(color);
        if (image)
            embed.setImage(image);
        ctx.data.reply({
            content: 'Embed alterada.',
            embeds: [embed],
            flags: 64,
        });
        (0, Customizations_1.setCustoms)(String(ctx.data.guildID), {
            messages: {
                ...customs.messages,
                dailyEmbed: {
                    title,
                    description,
                    type: 'rich',
                    color: color
                        ? parseInt(color.toUpperCase().replace('#', ''), 16)
                        : 0,
                    image: image
                        ? {
                            url: image,
                        }
                        : undefined,
                },
            },
        });
    },
});
