"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var PageDataRoutes_1 = __importDefault(require("./PageDataRoutes"));
var TrackingRoutes_1 = __importDefault(require("./TrackingRoutes"));
var ContactRoutes_1 = __importDefault(require("./ContactRoutes"));
function getRequestIp(req, res, next) {
    try {
        var ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
        req.headers.ip = ip.includes(":") ? ip.split(":")[ip.split(":").length - 1] : ip;
        return next();
    }
    catch (error) {
        return next();
    }
}
function validateRequest(req, res, next) {
    var toAccept = "jdsiwuud3992083hjhd87y3eu3ihedkhd37239ehde8";
    if (req.headers.key === toAccept) {
        return next();
    }
    else {
        return res.send({ data: "Requester " + (req.headers.ip || '') + " is not allowed." });
    }
}
var DEFAULT_MIDDLEWARE = [
    getRequestIp,
    validateRequest
];
var Routes = /** @class */ (function () {
    function Routes(Database) {
        this.Database = Database;
        this.endpointList = (new PageDataRoutes_1["default"](this.Database).routes).concat((new TrackingRoutes_1["default"](this.Database).routes), (new ContactRoutes_1["default"](this.Database).routes));
    }
    Routes.prototype.endpoints = function () {
        var router = express_1["default"].Router();
        this.endpointList.forEach(function (endpoint) {
            router[endpoint.method].apply(router, [endpoint.path].concat((endpoint.middleware && endpoint.middleware.length ? DEFAULT_MIDDLEWARE.concat(endpoint.middleware) : DEFAULT_MIDDLEWARE), [endpoint.handler]));
        });
        router.all("*", getRequestIp, function (req, res) {
            return res.send({ data: "Requester " + (req.headers.ip || '') + " is not allowed." });
        });
        return router;
    };
    return Routes;
}());
exports["default"] = Routes;
