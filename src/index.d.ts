import express from "express";
import { Router, NextFunction } from "express-serve-static-core";
import Database from "./database/Database";

export type EndpointList = Array<{
    path: string,
    method: "get" | "post" | "put" | "delete",
    middleware?: Array<(req: express.Request, res: express.Response, next: NextFunction) => any>,
    handler: (req: express.Request, res: express.Response) => any
}>

export type DefaultMiddleware = ((...args: any[]) => any) [];

export interface RoutingEndpoint {
    Database?: Database;
    routes: EndpointList;
}