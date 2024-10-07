"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_db_manager_1 = require("json-db-manager");
exports.default = new (class DataManager {
    clashes = new Map();
    customizations = new json_db_manager_1.JsonDB(0, 'utf-8', true).path('./customs.db.json');
})();
