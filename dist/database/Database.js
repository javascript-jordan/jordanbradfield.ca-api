"use strict";
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var Database = /** @class */ (function () {
    function Database(url) {
        this.db = null;
        this.databaseName = "jordan";
        this.client = new mongodb_1.MongoClient(url, {
            useNewUrlParser: true
        });
    }
    Database.prototype.findOne = function (collection, query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.collection(collection).findOne(query).then(resolve)["catch"](function (error) {
                console.error("Error finding one in collection " + collection + " with query " + (query ? JSON.stringify(query) : "") + " and error " + (typeof error !== "string" ? JSON.stringify(error) : error));
                return reject(error);
            });
        });
    };
    Database.prototype.findMany = function (collection, query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.collection(collection).find(query).toArray().then(resolve)["catch"](function (error) {
                console.error("Error finding in collection " + collection + " with query " + (query ? JSON.stringify(query) : "") + " and error " + (typeof error !== "string" ? JSON.stringify(error) : error));
                return reject(error);
            });
        });
    };
    Database.prototype.insertOne = function (collection, doc) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.collection(collection).insertOne(Object.assign({}, doc, { created: new Date() })).then(resolve)["catch"](function (error) {
                console.error("Error inserting one into collection " + collection + " with error " + (typeof error !== "string" ? JSON.stringify(error) : error));
                return reject(error);
            });
        });
    };
    Database.prototype.insertMany = function (collection, docs) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.collection(collection).insertMany(docs.map(function (doc) { doc.created = new Date(); return doc; })).then(resolve)["catch"](function (error) {
                console.error("Error inserting many into collection " + collection + " with error " + (typeof error !== "string" ? JSON.stringify(error) : error));
                return reject(error);
            });
        });
    };
    Database.prototype.connect = function () {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, reject) {
            _this.client.connect().then(function (client) {
                self.db = client.db(_this.databaseName);
                return resolve(self);
            })["catch"](function (error) {
                console.error("Error connecting to mongo database: " + (typeof error !== "string" ? JSON.stringify(error) : error));
                return reject();
            });
        });
    };
    return Database;
}());
exports["default"] = Database;
