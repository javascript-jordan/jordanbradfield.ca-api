"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var location_1 = require("./location");
var mailer_1 = __importDefault(require("./mailer"));
var DAILY_TIMER = 1000 * 60 * 60 * 24;
var WEEKLY_TIMER = 1000 * 60 * 60 * 24 * 7;
function getHTMLReport(fromWhen, reportType) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var dateRange = {
            from: fromWhen,
            to: new Date()
        }, emailToSend = "", userList = [], self = _this, appPages = {
            "/home": 0,
            "/about": 0,
            "/skills": 0,
            "/experience": 0,
            "/qualifications": 0,
            "/contact": 0
        };
        _this.Database.findMany("users", { created: { $gt: dateRange.from, $lt: dateRange.to } }).then(function (users) {
            var i = users && users.length - 1, end = 0;
            emailToSend += "<html><body><h1>" + reportType + " Report</h1><hr><h2>New Users (" + ((users && users.length) || 0) + ")</h2>";
            if (typeof i === "number") {
                for (; i >= end; i--) {
                    var user = users[i];
                    userList.push(user);
                    emailToSend = emailToSend.concat("<div>New User visited at <b>" + user.created + "</b> from <u>" + location_1.getLocationString(user.location) + "</u> on platform " + user.platform + ".</div>");
                }
            }
            else {
                emailToSend += "<div>No New users</div>";
            }
            emailToSend += "<hr><h2>Page Views</h2>";
            return _this.Database.findMany("page-views", { created: { $gt: dateRange.from, $lt: dateRange.to } });
        }).then(function (views) {
            var i = views && views.length - 1, end = 0;
            if (typeof i === "number") {
                for (; i >= end; i--) {
                    var view = views[i];
                    try {
                        if (typeof appPages[view.page] === "number") {
                            ++appPages[view.page];
                        }
                    }
                    catch (error) {
                    }
                }
                for (var page in appPages) {
                    emailToSend += "<div>" + page + ": <b>" + appPages[page] + "</b> views</div>";
                }
            }
            else {
                emailToSend += "<div>No New Page Views</div>";
            }
            emailToSend += "</body></html>";
            return resolve(emailToSend);
        })["catch"](function (error) {
            console.error("Error generating report for statistics: " + error && typeof error !== "string" ? JSON.stringify(error) : error);
            return reject();
        });
    });
}
function sendDailyReport() {
    getHTMLReport.call(this, new Date(new Date().getTime() - DAILY_TIMER), "Daily").then(function (email) {
        return mailer_1["default"]("JB Daily Analytics Report", email);
    })["catch"](function (error) {
        console.log("Caught error in daily report: " + (error && typeof error !== 'string' ? JSON.stringify(error) : error));
    });
}
function sendWeeklyReport() {
    getHTMLReport.call(this, new Date(new Date().getTime() - WEEKLY_TIMER), "Weekly").then(function (email) {
        return mailer_1["default"]("JB Weekly Analytics Report", email);
    })["catch"](function (error) {
        console.log("Caught error in weekly report: " + (error && typeof error !== 'string' ? JSON.stringify(error) : error));
    });
}
exports.startAlalyticsInterval = function (Database) {
    setInterval(sendDailyReport.bind({ Database: Database }), DAILY_TIMER);
    setInterval(sendWeeklyReport.bind({ Database: Database }), WEEKLY_TIMER);
};
