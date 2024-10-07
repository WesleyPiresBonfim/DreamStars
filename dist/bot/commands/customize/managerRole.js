"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createCommand_1 = require("../../models/createCommand");
const oceanic_js_1 = require("oceanic.js");
const Customizations_1 = require("../../utils/Customizations");
const Embed_1 = require("../../structure/builders/Embed");
const env_1 = require("../../../env");
exports.default = (0, createCommand_1.createCommand)({
    name: 'gerente',
    description: 'Customize o cargo de gerente dos confrontos (é usado para verificar permissão)',
    type: 'command',
    args: {
        role: {
            name: 'cargo',
            type: oceanic_js_1.ApplicationCommandOptionTypes.ROLE,
            description: 'Cargo de gerente dos confrontos',
            required: true,
        },
    },
    run: async (ctx) => {
        const customs = (0, Customizations_1.getCustoms)(String(ctx.data.guildID));
        const role = ctx.args.role;
        if (!(env_1.enhancer.env.DEVS_ID.split(',').includes(ctx.data.user.id) ||
            ctx.data.member?.roles.includes(String(customs.clashesManagerRoleID)))) {
            return ctx.data.reply({
                content: 'Você não tem permissão para customizar.',
                flags: 64,
            });
        }
        (0, Customizations_1.setCustoms)(String(ctx.data.guildID), {
            clashesManagerRoleID: role,
        });
        ctx.data.reply({
            content: 'Cargo de gerencia atualizado!',
            embeds: [
                new Embed_1.Embed()
                    .setDescription(`${customs.clashesManagerRoleID
                    ? `> Antigo: <@&${customs.clashesManagerRoleID}>`
                    : ''}\n> Novo: <@&${role}>`)
                    .setColorHex('#ff4343'),
            ],
            flags: 64,
        });
    },
});
