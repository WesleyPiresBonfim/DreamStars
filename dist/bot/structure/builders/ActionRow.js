"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRow = void 0;
class ActionRow {
    type = 1;
    components = [];
    addComponent(component) {
        this.components.push(component);
        return this;
    }
    addComponents(...components) {
        this.components = this.components.concat(components);
        return this;
    }
}
exports.ActionRow = ActionRow;
