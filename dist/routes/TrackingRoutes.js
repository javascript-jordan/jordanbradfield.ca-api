"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var location_1 = require("../helpers/location");
var mailer_1 = __importDefault(require("../helpers/mailer"));
var util_1 = require("../helpers/util");
var TrackingRoutes = /** @class */ (function () {
    function TrackingRoutes(Database) {
        this.pageViewCollectionName = "page-views";
        this.usersCollectionName = "users";
        this.routes = [
            {
                path: "/tracking/page",
                method: "post",
                handler: this.onNewPageView.bind(this)
            },
            {
                path: "/tracking/users",
                method: "post",
                handler: this.onNewUser.bind(this),
                middleware: [location_1.getLocationFromIpMiddleware]
            },
            {
                path: "/tracking/error",
                method: "post",
                handler: this.onNewError.bind(this)
            }
        ];
        this.Database = Database;
    }
    TrackingRoutes.prototype.onNewPageView = function (req, res) {
        this.Database.insertOne(this.pageViewCollectionName, __assign({}, req.body, { uuid: req.headers.uuid })).then(util_1.defaultSuccessCallback.bind(null, res))["catch"](function (error) {
            console.error("Error inserting page view: " + (error && typeof error !== "string" ? JSON.stringify(error) : error));
            return res.status(500).send({ error: true, data: "FAILED_INSERTING_PAGE_VIEW" });
        });
    };
    TrackingRoutes.prototype.onNewUser = function (req, res) {
        Promise.all([
            this.Database.insertOne(this.usersCollectionName, {
                uuid: req.headers.uuid,
                location: req.headers.location,
                platform: req.headers.platform,
                locale: req.headers.locale,
                agent: req.headers.agent
            }),
            mailer_1["default"]("New Visitor", "\n                <html>\n                    <body>\n                        <h1>Someone new visited</h1>\n                        <br>\n                        <h3>Location - " + location_1.getLocationString(req.headers.location, true) + "</h3>\n                        <h3>Platform - " + req.headers.platform + "</h3>\n                        <h3>Locale - " + req.headers.locale + "</h3>\n                        <h3>User Agent - " + req.headers.agent + "</h3>\n                        <h3>Time - " + new Date().toLocaleString() + "</h3>\n                        <h3>UUID - " + req.headers.uuid + "</h3>\n                    </body>\n                </html>\n            ")
        ]).then(util_1.defaultSuccessCallback.bind(null, res))["catch"](function (error) {
            console.error("Error tracking new user: " + (error && typeof error !== "string" ? JSON.stringify(error) : error));
            return res.status(500).send({ error: true, data: "FAILED_TRACKING_USER" });
        });
    };
    TrackingRoutes.prototype.onNewError = function (req, res) {
        this.Database.insertOne("errors", { error: req.body.error, agent: req.headers.agent, platform: req.headers.platform }).then(util_1.defaultSuccessCallback.bind(null, res))["catch"](function (error) {
            console.error("Error inserting captured exception from client: " + (error && typeof error !== "string" ? JSON.stringify(error) : error));
            return res.status(500).send({ error: true, data: "ERROR_INSERTING_EXCEPTION" });
        });
    };
    return TrackingRoutes;
}());
exports["default"] = TrackingRoutes;
