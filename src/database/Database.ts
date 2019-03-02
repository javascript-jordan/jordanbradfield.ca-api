import { MongoClient, Db, FilterQuery } from "mongodb";

export default class Database {

    private client: MongoClient;
    private db: null | Db = null;
    private databaseName: string = "jordan";

    constructor(url: string){
        this.client = new MongoClient(url, {
            useNewUrlParser: true
        });
    }

    public findOne(collection: string, query: FilterQuery<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).findOne(query).then(resolve).catch(error => {
                console.error(`Error finding one in collection ${collection} with query ${query ? JSON.stringify(query) : ""} and error ${typeof error !== "string" ? JSON.stringify(error) : error}`);
                return reject(error);
            });
        });
    }

    public findMany(collection: string, query: { [key: string]: any }) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).find(query).toArray().then(resolve).catch(error => {
                console.error(`Error finding in collection ${collection} with query ${query ? JSON.stringify(query) : ""} and error ${typeof error !== "string" ? JSON.stringify(error) : error}`);
                return reject(error);
            });
        });
    }

    public insertOne(collection: string, doc: { [key: string]: any }) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).insertOne(Object.assign({}, doc, {created: new Date()})).then(resolve).catch(error => {
                console.error(`Error inserting one into collection ${collection} with error ${typeof error !== "string" ? JSON.stringify(error) : error}`);
                return reject(error);
            });
        });
    }

    public insertMany(collection: string, docs: [ { [key: string]: any }]) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).insertMany(docs.map(doc => {doc.created = new Date(); return doc;})).then(resolve).catch(error => {
                console.error(`Error inserting many into collection ${collection} with error ${typeof error !== "string" ? JSON.stringify(error) : error}`);
                return reject(error);
            });
        });
    }

    public connect(): Promise<Database> {
        let self = this;
        return new Promise((resolve, reject) => {
            this.client.connect().then((client: MongoClient) => {
                self.db = client.db(this.databaseName);
                return resolve(self);
            }).catch(error => {
                console.error(`Error connecting to mongo database: ${typeof error !== "string" ? JSON.stringify(error) : error}`);
                return reject();
            });
        });
    }
}