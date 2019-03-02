import express, { NextFunction } from "express";
import Database from "../database/Database";
import { EndpointList } from "../index.d";
import { RoutingEndpoint } from "../index.d";
import { getLocationFromIpMiddleware, getLocationString, getLocation } from "../helpers/location";
import { default as sendMail } from "../helpers/mailer";
import { defaultSuccessCallback } from "../helpers/util";

export default class TrackingRoutes implements RoutingEndpoint {

    Database: Database;

    private pageViewCollectionName: string = "page-views";
    private usersCollectionName: string = "users";

    routes: EndpointList = [
        {
            path: "/tracking/page",
            method: "post",
            handler: this.onNewPageView.bind(this)
        },
        {
            path: "/tracking/users",
            method: "post",
            handler: this.onNewUser.bind(this),
            middleware: [getLocationFromIpMiddleware]
        },
        {
            path: "/tracking/error",
            method: "post",
            handler: this.onNewError.bind(this)
        }
    ]

    constructor(Database: Database){
        this.Database = Database;
    }

    private onNewPageView(req: express.Request, res: express.Response): void {
        this.Database.insertOne(this.pageViewCollectionName, {
            ...req.body,
            uuid: req.headers.uuid
        }).then(defaultSuccessCallback.bind(null, res)).catch(error => {
            console.error(`Error inserting page view: ${error && typeof error !== "string" ? JSON.stringify(error) : error}`);
            return res.status(500).send({error: true, data: "FAILED_INSERTING_PAGE_VIEW"});
        });
    }

    private onNewUser(req: express.Request, res: express.Response): void {
        Promise.all([
            this.Database.insertOne(this.usersCollectionName, {
                uuid: req.headers.uuid,
                location: req.headers.location,
                platform: req.headers.platform,
                locale: req.headers.locale,
                agent: req.headers.agent
            }),
            sendMail("New Visitor", `
                <html>
                    <body>
                        <h1>Someone new visited</h1>
                        <br>
                        <h3>Location - ${getLocationString(req.headers.location, true)}</h3>
                        <h3>Platform - ${req.headers.platform}</h3>
                        <h3>Locale - ${req.headers.locale}</h3>
                        <h3>User Agent - ${req.headers.agent}</h3>
                        <h3>Time - ${new Date().toLocaleString()}</h3>
                        <h3>UUID - ${req.headers.uuid}</h3>
                    </body>
                </html>
            `)
        ]).then(defaultSuccessCallback.bind(null, res)).catch(error => {
            console.error(`Error tracking new user: ${error && typeof error !== "string" ? JSON.stringify(error) : error}`);
            return res.status(500).send({error: true, data: "FAILED_TRACKING_USER"});
        });
    }

    private onNewError(req: express.Request, res: express.Response): void {
        this.Database.insertOne("errors", {error: req.body.error, agent: req.headers.agent, platform: req.headers.platform}).then(defaultSuccessCallback.bind(null, res)).catch(error => {
            console.error(`Error inserting captured exception from client: ${error && typeof error !== "string" ? JSON.stringify(error) : error}`);
            return res.status(500).send({error: true, data: "ERROR_INSERTING_EXCEPTION"});
        });
    }

}