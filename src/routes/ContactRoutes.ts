import express from "express";
import { RoutingEndpoint, EndpointList } from "../index.d";
import Database from "../database/Database";
import { getLocationFromIpMiddleware, getLocationString } from "../helpers/location";
import { default as sendMail } from "../helpers/mailer";
import { defaultSuccessCallback } from "../helpers/util";

export default class ContactRoutes implements RoutingEndpoint {

    private contactEmailSubject: string = "New email";

    private databaseCollectionName: string = "emails-received";

    Database: Database;

    routes: EndpointList = [
        {
            path: "/contact/email",
            method: "post",
            handler: this.contactViaEmail.bind(this),
            middleware: [getLocationFromIpMiddleware]
        }
    ];

    constructor(Database: Database){
        this.Database = Database;
    }

    private contactViaEmail(req: express.Request, res: express.Response): void {
        let fromName: string = req.body.fromName,
            fromEmail: string = req.body.fromEmail,
            body: string = req.body.body;
        Promise.all([sendMail(this.contactEmailSubject, `
            <html>
                <body>
                    <h1><u>New email</u></h1>
                    <div>
                        Sent By Name: <b>${fromName}</b>
                    </div>
                    <div>
                        Sent By Email: <b>${fromEmail}</b>
                    </div>
                    <div>
                        Location: ${getLocationString(req.headers.location, true)}
                    </div>
                    <br><br>
                    <div>
                        <b>${body}</b>
                    </div>
                </body>
            </html>
        `), this.Database.insertOne(this.databaseCollectionName, {
            fromName,
            fromEmail,
            body,
            uuid: req.headers.uuid
        })]).then(defaultSuccessCallback.bind(null, res)).catch(error => {
            console.error(`Error in contact via mail: ${typeof error === "string" ? error : JSON.stringify(error)}`);
            return res.status(500).send({error: true, data: "FAIL_SENDING_EMAIL"});
        });
    }

}