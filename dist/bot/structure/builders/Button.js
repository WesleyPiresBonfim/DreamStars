"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = exports.BUTTON_STYLES = void 0;
exports.BUTTON_STYLES = {
    PRIMARY: 1,
    SECONDARY: 2,
    SUCCESS: 3,
    DANGER: 4,
    URL: 5
};
class Button {
    customID;
    url;
    disabled = false;
    emoji;
    label;
    style = 1;
    type = 2;
    addArgument(key, value) {
        this.customID += `;${key}:${value}`;
        return this;
    }
    setID(id) {
        this.customID = id;
        this.url = undefined;
        if (this.style === 5)
            this.style = 1;
        return this;
    }
    setURL(url) {
        this.customID = undefined;
        this.url = url;
        this.style = 5;
        return this;
    }
    setDisabled(disabled = true) {
        this.disabled = disabled;
        return this;
    }
    setEmoji(emoji) {
        if (typeof emoji === "string")
            this.emoji = { name: emoji };
        else
            this.emoji = emoji;
        return this;
    }
    setLabel(label) {
        this.label = label;
        return this;
    }
    setStyle(style) {
        this.style = exports.BUTTON_STYLES[style];
        return this;
    }
}
exports.Button = Button;
