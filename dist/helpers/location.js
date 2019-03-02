"use strict";
exports.__esModule = true;
var request_1 = require("request");
var API_URL = "http://ip-api.com/json/";
exports.getLocation = function (ip) {
    return new Promise(function (resolve) {
        var resolved = null;
        if (ip) {
            request_1.get(API_URL + ip, function (error, response, data) {
                if (!error) {
                    try {
                        resolved = JSON.parse(data);
                    }
                    catch (error) {
                    }
                }
                else {
                    console.error(error);
                }
                return resolve(resolved);
            });
        }
        else {
            return resolve(resolved);
        }
    });
};
exports.getLocationFromIpMiddleware = function (req, res, next) {
    exports.getLocation(req.headers.ip).then(function (location) {
        req.headers.location = location;
        return next();
    });
};
exports.getLocationString = function (location, html) {
    try {
        return html ? "City: <b>" + location.city + "</b> Province: <b>" + location.regionName + "</b> Country: <b>" + location.country + "</b>"
            : "City: " + location.city + " Province: " + location.regionName + " Country: " + location.country;
    }
    catch (error) {
        console.error(error);
        return "Error parsing location";
    }
};
