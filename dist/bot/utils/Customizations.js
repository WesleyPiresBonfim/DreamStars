"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCustoms = exports.getCustoms = void 0;
const Data_1 = __importDefault(require("../../managers/Data"));
const env_1 = require("../../env");
const getCustoms = (guildId) => {
    return Object.assign({
        clashesManagerRoleID: env_1.enhancer.env.DEFAULT_CLASHES_MANAGER_ROLE_ID,
        functions: {
            sortOrder: 'PRIORITIZED',
            threads: true,
        },
        messages: {
            dailyEmbed: {
                title: 'Iniciando Diário',
                description: 'Aguardando jogadores... <a:loading:1270082311928549376>',
                type: 'rich',
                color: 16728899,
                image: {
                    url: 'https://media.discordapp.net/attachments/1176945659157434530/1270080442539835475/Diario.PNG?ex=66b26616&is=66b11496&hm=626ebfdc9a5c54cd3968b72c31b471e986ce30e38c2a1074c30ce5fe2cf95664&=&format=webp&quality=lossless&width=1025&height=323',
                },
            },
        },
    }, Object(Data_1.default.customizations.get(guildId)));
};
exports.getCustoms = getCustoms;
const setCustoms = (guildId, data) => {
    const _ = getCustoms(guildId);
    data = Object.assign(_, data);
    Data_1.default.customizations.set(guildId, data);
    return data;
};
exports.setCustoms = setCustoms;
