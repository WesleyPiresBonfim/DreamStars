"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oceanic_js_1 = require("oceanic.js");
const createCommand_1 = require("../../../models/createCommand");
const Customizations_1 = require("../../../utils/Customizations");
const env_1 = require("../../../../env");
exports.default = (0, createCommand_1.createCommand)({
    name: 'threads',
    description: 'Uso das threads',
    type: 'command',
    args: {
        use: {
            name: 'uso',
            type: oceanic_js_1.ApplicationCommandOptionTypes.BOOLEAN,
            description: 'Ativar ou desativar o uso das threads',
            required: true,
        },
    },
    run: async (ctx) => {
        const customs = (0, Customizations_1.getCustoms)(String(ctx.data.guildID));
        const use = ctx.args.use;
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
                threads: use,
            },
        });
        ctx.data.reply({
            content: `Agora o uso das Threads é ${use ? 'permitido' : 'dispensado'}`,
            flags: 64,
        });
    },
});
