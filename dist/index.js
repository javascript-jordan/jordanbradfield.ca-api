"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = require("body-parser");
var Database_1 = __importDefault(require("./database/Database"));
var Routes_1 = __importDefault(require("./routes/Routes"));
var analytics_1 = require("./helpers/analytics");
var pinger_1 = __importDefault(require("./helpers/pinger"));
var PORT = process.env.PORT || 3000;
var DATABASE_URL = process.env.DATABASE_URL || "mongodb://";
new Database_1["default"](DATABASE_URL).connect().then(function (Database) {
    express_1["default"]().use(body_parser_1.json()).use(cors_1["default"]()).use("/", new Routes_1["default"](Database).endpoints()).listen(PORT, function () {
        console.log("Server startup at " + new Date().toLocaleDateString() + " on port " + PORT);
        analytics_1.startAlalyticsInterval(Database);
        pinger_1["default"]();
    });
})["catch"](function () {
    return process.exit(1);
});
