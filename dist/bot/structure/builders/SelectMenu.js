"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectOption = exports.SelectMenu = exports.ChannelSelectMenuBuilder = exports.AutoPopulatedSelectMenuBuilder = exports.TextSelectMenuBuilder = exports.SELECT_MENU_TYPES = void 0;
exports.SELECT_MENU_TYPES = {
    STRING: 3,
    USER: 5,
    ROLE: 6,
    MENTIONABLE: 7,
    CHANNEL: 8
};
class BaseSelectMenuBuilder {
    customID;
    placeholder;
    min_values = 1;
    max_values = 1;
    disabled = false;
    setID(id) {
        this.customID = id;
        return this;
    }
    setPlaceholder(text) {
        this.placeholder = text;
        return this;
    }
    setMinValues(amount) {
        this.min_values = amount;
        return this;
    }
    setMaxValues(amount) {
        this.max_values = amount;
        return this;
    }
    setDisabled(d) {
        this.disabled = d;
        return this;
    }
}
class TextSelectMenuBuilder extends BaseSelectMenuBuilder {
    type = 3;
    options = [];
    addOption(option) {
        this.options.push(option);
        return this;
    }
    addOptions(...options) {
        this.options = this.options.concat(options);
        return this;
    }
}
exports.TextSelectMenuBuilder = TextSelectMenuBuilder;
class AutoPopulatedSelectMenuBuilder extends BaseSelectMenuBuilder {
    type;
    default_values = [];
    constructor(type) {
        super();
        this.type = type;
    }
    addDefaultValue(id, ...type) {
        let t;
        if (this.type === 5)
            t = "user";
        else if (this.type === 6)
            t = "role";
        else if (this.type === 8)
            t = "channel";
        else
            t = type[0] || "user";
        this.default_values.push({
            id, type: t
        });
        return this;
    }
}
exports.AutoPopulatedSelectMenuBuilder = AutoPopulatedSelectMenuBuilder;
class ChannelSelectMenuBuilder extends AutoPopulatedSelectMenuBuilder {
    channelTypes = [];
    constructor() {
        super(8);
    }
    setChannelTypes(types) {
        this.channelTypes = types;
        return this;
    }
}
exports.ChannelSelectMenuBuilder = ChannelSelectMenuBuilder;
class SelectMenu {
    setType(type) {
        if (type === "STRING") {
            return new TextSelectMenuBuilder();
        }
        else if (type === "CHANNEL") {
            return new ChannelSelectMenuBuilder();
        }
        else {
            const t = type;
            return new AutoPopulatedSelectMenuBuilder(exports.SELECT_MENU_TYPES[t]);
        }
    }
}
exports.SelectMenu = SelectMenu;
class SelectOption {
    label;
    value;
    description;
    emoji;
    default = false;
    setLabel(label) {
        this.label = label;
        return this;
    }
    setValue(value) {
        this.value = value;
        return this;
    }
    setDescription(description) {
        this.description = description;
        return this;
    }
    setEmoji(e) {
        if (typeof e === "string")
            this.emoji = { name: e };
        else
            this.emoji = e;
        return this;
    }
    setDefault(d) {
        this.default = d;
        return this;
    }
}
exports.SelectOption = SelectOption;
