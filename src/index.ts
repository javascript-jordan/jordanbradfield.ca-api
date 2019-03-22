import express from "express";
import cors from "cors";
import { json } from "body-parser";
import Database from "./database/Database";
import Router from "./routes/Routes";
import { startAlalyticsInterval } from "./helpers/analytics";
import { default as startPingingInterval } from "./helpers/pinger";

const PORT: number | string = process.env.PORT || 3000;
const DATABASE_URL: string = process.env.DATABASE_URL || "mongodb://";

new Database(DATABASE_URL).connect().then((Database: Database) => {
    express().use(json()).use(cors()).use("/", new Router(Database).endpoints()).listen(PORT, () => {
        console.log(`Server startup at ${new Date().toLocaleDateString()} on port ${PORT}`);
        /**
         * Free Heroku dynos can only have a certain amount of up time per month.
         * The goal was set a ping every 20 minutes to avoid sleeping.
         * The next solution will be a paid dyno to avoid sleeping.
         * After the ping interval can be removed and Analytics reports activated.
         */
        // startAlalyticsInterval(Database);
        // startPingingInterval();
    });
}).catch(() => {
    return process.exit(1);
});