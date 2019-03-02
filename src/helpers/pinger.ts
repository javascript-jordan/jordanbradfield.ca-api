import { get } from "https";

const PING_INTERVAL: number = 1000 * 60 * 20;
const URL: string = "https://jordanbradfield-api.herokuapp.com/";

function ping(){
    try {
        get(URL, (res) => {
            res.on("error", error => {
                console.log(`Error pringing ${URL} with error: ${error && typeof error !== "string" ? JSON.stringify(error) : error}`);
            });
            res.on("data", () => console.log(`${new Date().toISOString()} - Successfully pinged ${URL}`));
        }).on("error", error => {
            console.error(`Error pinging Server URL ${URL} with error: ${error && typeof error !== "string" ? JSON.stringify(error) : error}`);
        });
    } catch (error) {
        console.error(`Error pinging server URL: ${URL}`);
    }
}

export default (): void => {
    setInterval(ping, PING_INTERVAL);
}