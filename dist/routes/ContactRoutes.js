"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var location_1 = require("../helpers/location");
var mailer_1 = __importDefault(require("../helpers/mailer"));
var util_1 = require("../helpers/util");
var ContactRoutes = /** @class */ (function () {
    function ContactRoutes(Database) {
        this.contactEmailSubject = "New email";
        this.databaseCollectionName = "emails-received";
        this.routes = [
            {
                path: "/contact/email",
                method: "post",
                handler: this.contactViaEmail.bind(this),
                middleware: [location_1.getLocationFromIpMiddleware]
            }
        ];
        this.Database = Database;
    }
    ContactRoutes.prototype.contactViaEmail = function (req, res) {
        var fromName = req.body.fromName, fromEmail = req.body.fromEmail, body = req.body.body;
        Promise.all([mailer_1["default"](this.contactEmailSubject, "\n            <html>\n                <body>\n                    <h1><u>New email</u></h1>\n                    <div>\n                        Sent By Name: <b>" + fromName + "</b>\n                    </div>\n                    <div>\n                        Sent By Email: <b>" + fromEmail + "</b>\n                    </div>\n                    <div>\n                        Location: " + location_1.getLocationString(req.headers.location, true) + "\n                    </div>\n                    <br><br>\n                    <div>\n                        <b>" + body + "</b>\n                    </div>\n                </body>\n            </html>\n        "), this.Database.insertOne(this.databaseCollectionName, {
                fromName: fromName,
                fromEmail: fromEmail,
                body: body,
                uuid: req.headers.uuid
            })]).then(util_1.defaultSuccessCallback.bind(null, res))["catch"](function (error) {
            console.error("Error in contact via mail: " + (typeof error === "string" ? error : JSON.stringify(error)));
            return res.status(500).send({ error: true, data: "FAIL_SENDING_EMAIL" });
        });
    };
    return ContactRoutes;
}());
exports["default"] = ContactRoutes;
