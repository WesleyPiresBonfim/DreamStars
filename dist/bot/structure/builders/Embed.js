"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
class Embed {
    title;
    description;
    type = "rich";
    url;
    color;
    timestamp;
    image;
    footer;
    author;
    fields = [];
    thumbnail;
    setAuthor(name, iconURL, url) {
        this.author = { name, iconURL, url };
        return this;
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setDescription(description) {
        this.description = description;
        return this;
    }
    setImage(url, height, width) {
        this.image = { url, height, width };
        return this;
    }
    setURL(url) {
        this.url = url;
        return this;
    }
    setColorHex(color) {
        if (!color) {
            this.color = undefined;
            return this;
        }
        this.color = parseInt(color.toUpperCase().replace("#", ""), 16);
        return this;
    }
    setColorRGB(r, g, b) {
        this.color = (r << 16) + (g << 8) + (b);
        return this;
    }
    setType(type) {
        this.type = type;
        return this;
    }
    setThumbnail(url) {
        this.thumbnail = { url };
        return this;
    }
    addField({ name, value, inline }) {
        this.fields.push({ name, value, inline });
        return this;
    }
    setFooter(text, iconURL) {
        this.footer = { text, iconURL };
        return this;
    }
    setTimestamp() {
        this.timestamp = String(Date.now());
        return this;
    }
}
exports.Embed = Embed;
