import express, { NextFunction } from "express";
import { get } from "request";

const API_URL: string = "http://ip-api.com/json/";

export const getLocation = (ip: string): Promise<Object> => {
    return new Promise(resolve => {
        let resolved: any = null;
        if(ip){
            get(API_URL + ip, (error, response, data) => {
                if(!error){
                    try {
                        resolved = JSON.parse(data);
                    } catch (error) {
                        
                    }
                }else{
                    console.error(error);
                }
                return resolve(resolved);
            });
        }else{
            return resolve(resolved);
        }
    });
}

export const getLocationFromIpMiddleware = (req: express.Request, res: express.Response, next: NextFunction): void => {
    getLocation(<string>req.headers.ip).then(location => {
        (<any>req.headers.location) = location;
        return next();
    });
} 

export const getLocationString = (location: any, html?: boolean): string => {
    try {
        return html ? `City: <b>${location.city}</b> Province: <b>${location.regionName}</b> Country: <b>${location.country}</b>`
            : `City: ${location.city} Province: ${location.regionName} Country: ${location.country}`;
    } catch (error) {
        console.error(error);
        return "Error parsing location";
    }
}