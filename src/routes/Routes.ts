import express from "express";
import { Router, NextFunction } from "express-serve-static-core";
import Database from "../database/Database";
import { default as PageDataRoutes } from "./PageDataRoutes";

import { EndpointList, DefaultMiddleware } from "../index.d";
import { default as TrackingRoutes } from "./TrackingRoutes";
import ContactRoutes from "./ContactRoutes";

function getRequestIp(req: express.Request, res: express.Response, next: NextFunction){
    try {
        let ip: any = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
        req.headers.ip = ip.includes(":") ? ip.split(":")[ip.split(":").length - 1] : ip;
        return next();
    } catch (error) {
        return next();
    }
}
function validateRequest(req: express.Request, res: express.Response, next: NextFunction){
    let toAccept: string = "jdsiwuud3992083hjhd87y3eu3ihedkhd37239ehde8";
    if(req.headers.key === toAccept){
        return next();
    }else{
        return res.send({data: `Requester ${req.headers.ip || ''} is not allowed.`});
    }
}

const DEFAULT_MIDDLEWARE: DefaultMiddleware = [
    getRequestIp,
    validateRequest
];

export default class Routes {

    private Database: Database;
    private endpointList: EndpointList;

    constructor(Database: Database){
        this.Database = Database;
        this.endpointList = [
            ...(new PageDataRoutes(this.Database).routes),
            ...(new TrackingRoutes(this.Database).routes),
            ...(new ContactRoutes(this.Database).routes)
        ]
    }

    public endpoints(): Router {
        let router: express.Router = express.Router();
        this.endpointList.forEach(endpoint => {
            router[endpoint.method](endpoint.path,
                ...(endpoint.middleware && endpoint.middleware.length ? [...DEFAULT_MIDDLEWARE, ...endpoint.middleware] : DEFAULT_MIDDLEWARE),
                endpoint.handler
            );
        });
        router.all("*", getRequestIp, (req: express.Request, res: express.Response) => {
            return res.send({data: `Requester ${req.headers.ip || ''} is not allowed.`})
        });
        return router;
    }
}