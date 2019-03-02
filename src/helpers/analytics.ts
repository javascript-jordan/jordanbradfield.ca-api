import Database from "../database/Database";
import { getLocationString } from "./location";
import SendMail from "./mailer";

const DAILY_TIMER: number = 1000 * 60 * 60 * 24;
const WEEKLY_TIMER: number = 1000 * 60 * 60 * 24 * 7;

function getHTMLReport(this: {Database: Database}, fromWhen: Date, reportType: string): Promise<string | void>{
    return new Promise((resolve, reject) => {
        let dateRange: {from: Date, to: Date} = {
            from: fromWhen,
            to: new Date()
        }, emailToSend: string = "", userList: any[] = [], self = this,
        appPages: {[key: string]: number} = {
            "/home":0,
            "/about":0,
            "/skills":0,
            "/experience":0,
            "/qualifications":0,
            "/contact":0
        };
        this.Database.findMany("users", {created: {$gt: dateRange.from, $lt: dateRange.to}}).then((users: any) => {
            let i: number = users && users.length - 1, end: number = 0;
            emailToSend += `<html><body><h1>${reportType} Report</h1><hr><h2>New Users (${(users && users.length) || 0})</h2>`;
            if(typeof i === "number"){
                for(; i >= end; i--){
                    let user = users[i];
                    userList.push(user);
                    emailToSend = emailToSend.concat(`<div>New User visited at <b>${user.created}</b> from <u>${getLocationString(user.location)}</u> on platform ${user.platform}.</div>`);
                }
            }else{
                emailToSend += "<div>No New users</div>";
            }
            emailToSend += "<hr><h2>Page Views</h2>";
            return this.Database.findMany("page-views", {created: {$gt: dateRange.from, $lt: dateRange.to}});
        }).then((views: any) => {
            let i: number = views && views.length - 1, end: number = 0;
            if(typeof i === "number"){
                for(; i >= end; i--){
                    let view: any = views[i];
                    try {
                        if(typeof appPages[view.page] === "number"){
                            ++appPages[view.page];
                        }
                    } catch (error) {
                        
                    }
                }
                for(var page in appPages){
                    emailToSend += `<div>${page}: <b>${appPages[page]}</b> views</div>`;
                }
            }else{
                emailToSend += "<div>No New Page Views</div>";
            }
            emailToSend += "</body></html>"
            return resolve(emailToSend);
        }).catch(error => {
            console.error("Error generating report for statistics: " + error && typeof error !== "string" ? JSON.stringify(error) : error);
            return reject();
        });
    });
}

function sendDailyReport(this: {Database: Database}): void {
    getHTMLReport.call(this, new Date(new Date().getTime() - DAILY_TIMER), "Daily").then((email: any) => {
        return SendMail("JB Daily Analytics Report", email);
    }).catch((error: any) => {
        console.log(`Caught error in daily report: ${error && typeof error !== 'string' ? JSON.stringify(error) : error}`);
    });
}

function sendWeeklyReport(this: {Database: Database}): void {
    getHTMLReport.call(this, new Date(new Date().getTime() - WEEKLY_TIMER), "Weekly").then((email: any) => {
        return SendMail("JB Weekly Analytics Report", email);
    }).catch((error: any) => {
        console.log(`Caught error in weekly report: ${error && typeof error !== 'string' ? JSON.stringify(error) : error}`);
    });
}

export const startAlalyticsInterval = (Database: Database): void => {
    setInterval(sendDailyReport.bind({Database: Database}), DAILY_TIMER);
    setInterval(sendWeeklyReport.bind({Database: Database}), WEEKLY_TIMER);
}