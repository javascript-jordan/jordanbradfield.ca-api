"use strict";
exports.__esModule = true;
var nodemailer_1 = require("nodemailer");
var googleapis_1 = require("googleapis");
var OAUTH2 = googleapis_1.google.auth.OAuth2;
var OUATH_CLIENTID = process.env.GOOGLE_CLIENT_ID;
var OUATH_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var OUATH_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
var EMAIL_ADDRESS = process.env.EMAIL_USER_NAME;
var EMAIL_PASSWORD = process.env.EMAIL_USER_PASSWORD;
var JORDANS_EMAIL = process.env.JORDANS_EMAIL;
var EMAIL_SENDER_NAME = "WebMailer";
var OAuth2Client = new OAUTH2(OUATH_CLIENTID, OUATH_CLIENT_SECRET, "https://developers.google.com/oauthplayground");
OAuth2Client.setCredentials({ refresh_token: OUATH_REFRESH_TOKEN });
exports["default"] = (function (subject, html) { return new Promise(function (resolve, reject) {
    OAuth2Client.getRequestHeaders().then(function (response) {
        var transporter = nodemailer_1.createTransport({
            service: "Gmail",
            headers: response,
            auth: {
                type: "OAuth2",
                user: EMAIL_ADDRESS,
                clientId: OUATH_CLIENTID,
                clientSecret: OUATH_CLIENT_SECRET,
                refreshToken: OUATH_REFRESH_TOKEN
            }
        }), mailOptions = {
            from: EMAIL_SENDER_NAME,
            to: JORDANS_EMAIL,
            subject: subject,
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                var credentials = {
                    EMAIL_ADDRESS: EMAIL_ADDRESS,
                    EMAIL_PASSWORD: EMAIL_PASSWORD,
                    JORDANS_EMAIL: JORDANS_EMAIL,
                    subject: subject,
                    html: html
                }, err = "";
                for (var key in credentials) {
                    if (!credentials[key]) {
                        err = "Required parameter " + key + " is undefined.";
                    }
                }
                if (!err) {
                    err = "Error sending mail: " + (error && typeof error !== "string" ? JSON.stringify(error) !== "[object Object]" ? JSON.stringify(error) : String(error) : error);
                }
                return reject(error);
            }
            else {
                return resolve(info);
            }
        });
    })["catch"](reject);
}); });
