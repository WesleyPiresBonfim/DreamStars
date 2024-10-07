"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionContext = exports.InternalInteraction = void 0;
exports.createInteraction = createInteraction;
class InternalInteraction {
    data;
    constructor(data) {
        this.data = data;
    }
}
exports.InternalInteraction = InternalInteraction;
class InteractionContext {
    userCreatorInteraction;
    customID;
    args;
    data;
    constructor(interaction) {
        this.data = interaction;
        this.userCreatorInteraction = interaction.message
            ? interaction.message.interactionMetadata.user.id
            : interaction.user.id;
        const args = interaction.data.customID.split(';');
        this.customID = args[0];
        args.shift();
        this.args = args;
    }
    getData(id) {
        const parser = this.args.find((i) => i.startsWith(id));
        return parser?.split(':')[1];
    }
}
exports.InteractionContext = InteractionContext;
function createInteraction(data) {
    return new InternalInteraction(data);
}
