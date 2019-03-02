import { createTransport, SendMailOptions } from "nodemailer";
import { google } from "googleapis";

const OAUTH2 = google.auth.OAuth2;
const OUATH_CLIENTID: string = process.env.GOOGLE_CLIENT_ID;
const OUATH_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET;
const OUATH_REFRESH_TOKEN: string = process.env.GOOGLE_REFRESH_TOKEN;
const EMAIL_ADDRESS: string = process.env.EMAIL_USER_NAME;
const EMAIL_PASSWORD: string = process.env.EMAIL_USER_PASSWORD;
const JORDANS_EMAIL: string = process.env.JORDANS_EMAIL;
const EMAIL_SENDER_NAME: string = "WebMailer";

const OAuth2Client = new OAUTH2(OUATH_CLIENTID, OUATH_CLIENT_SECRET, "https://developers.google.com/oauthplayground");

OAuth2Client.setCredentials({refresh_token: OUATH_REFRESH_TOKEN});

export default (subject: string, html: string): Promise<any> => new Promise((resolve, reject) => {
    OAuth2Client.getRequestHeaders().then(response => {
        let transporter: any = createTransport({
            service: "Gmail",
            headers: response,
            auth: {
                type: "OAuth2",
                user: EMAIL_ADDRESS, 
                clientId: OUATH_CLIENTID,
                clientSecret: OUATH_CLIENT_SECRET,
                refreshToken: OUATH_REFRESH_TOKEN
            }
        }),
        mailOptions: SendMailOptions = {
            from: EMAIL_SENDER_NAME,
            to: JORDANS_EMAIL,
            subject,
            html
        };
        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if(error){
                let credentials: { [key: string]: any } = {
                    EMAIL_ADDRESS,
                    EMAIL_PASSWORD,
                    JORDANS_EMAIL,
                    subject,
                    html
                }, err: string = "";
                for(let key in credentials){
                    if(!credentials[key]){
                        err = `Required parameter ${key} is undefined.`;
                    }
                }
                if(!err){
                    err = `Error sending mail: ${error && typeof error !== "string" ? JSON.stringify(error) !== "[object Object]" ? JSON.stringify(error) : String(error) : error}`;
                }
                return reject(error);
            }else{
                return resolve(info);
            }
        });
    }).catch(reject);
});