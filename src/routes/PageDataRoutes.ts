import express from 'express';
import { EndpointList, RoutingEndpoint } from "../index.d";
import Database from "../database/Database";

export default class PageDataRoutes implements RoutingEndpoint {

    Database: Database;

    private pageDataCollectionName: string = "page-data";
    private pageDataToCollectionMap: { [key: string]: any } = {
        home: "home",
        skills: "skills",
        experience: "experience",
        qualifications: "qualifications",
        contact: "contact",
        about: "about"
    }

    routes: EndpointList = [
        {
            path: "/data/page/:page",
            method: "get",
            handler: this.getPageData.bind(this)
        }
    ];


    constructor(Database: Database){
        this.Database = Database;
    }

    private getPageData(req: express.Request, res: express.Response): express.Response {
        let page: string = this.pageDataToCollectionMap[req.params.page];
        if(page){
            this.Database.findOne(this.pageDataCollectionName, {page: page}).then(data => res.send({data}))
                .catch(() => res.send({error: `Error searching for page ${page} in ${this.pageDataCollectionName}`}));
        }else{
            return res.send({error: `Could not get page data for page ${req.path}`});
        }
    }


}