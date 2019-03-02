"use strict";
exports.__esModule = true;
var https_1 = require("https");
var PING_INTERVAL = 1000 * 60 * 20;
var URL = "https://jordanbradfield-api.herokuapp.com/";
function ping() {
    try {
        https_1.get(URL, function (res) {
            res.on("error", function (error) {
                console.log("Error pringing " + URL + " with error: " + (error && typeof error !== "string" ? JSON.stringify(error) : error));
            });
            res.on("data", function () { return console.log(new Date().toISOString() + " - Successfully pinged " + URL); });
        }).on("error", function (error) {
            console.error("Error pinging Server URL " + URL + " with error: " + (error && typeof error !== "string" ? JSON.stringify(error) : error));
        });
    }
    catch (error) {
        console.error("Error pinging server URL: " + URL);
    }
}
exports["default"] = (function () {
    setInterval(ping, PING_INTERVAL);
});
