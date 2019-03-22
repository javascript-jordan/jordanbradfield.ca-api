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
var PORT = process.env.PORT || 3000;
var DATABASE_URL = process.env.DATABASE_URL || "mongodb://";
new Database_1["default"](DATABASE_URL).connect().then(function (Database) {
    express_1["default"]().use(body_parser_1.json()).use(cors_1["default"]()).use("/", new Routes_1["default"](Database).endpoints()).listen(PORT, function () {
        console.log("Server startup at " + new Date().toLocaleDateString() + " on port " + PORT);
        /**
         * Free Heroku dynos can only have a certain amount of up time per month.
         * The goal was set a ping every 20 minutes to avoid sleeping.
         * The next solution will be a paid dyno to avoid sleeping.
         * After the ping interval can be removed and Analytics reports activated.
         */
        // startAlalyticsInterval(Database);
        // startPingingInterval();
    });
})["catch"](function () {
    return process.exit(1);
});
