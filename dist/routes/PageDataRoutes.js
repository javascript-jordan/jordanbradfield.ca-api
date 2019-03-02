"use strict";
exports.__esModule = true;
var PageDataRoutes = /** @class */ (function () {
    function PageDataRoutes(Database) {
        this.pageDataCollectionName = "page-data";
        this.pageDataToCollectionMap = {
            home: "home",
            skills: "skills",
            experience: "experience",
            qualifications: "qualifications",
            contact: "contact",
            about: "about"
        };
        this.routes = [
            {
                path: "/data/page/:page",
                method: "get",
                handler: this.getPageData.bind(this)
            }
        ];
        this.Database = Database;
    }
    PageDataRoutes.prototype.getPageData = function (req, res) {
        var _this = this;
        var page = this.pageDataToCollectionMap[req.params.page];
        if (page) {
            this.Database.findOne(this.pageDataCollectionName, { page: page }).then(function (data) { return res.send({ data: data }); })["catch"](function () { return res.send({ error: "Error searching for page " + page + " in " + _this.pageDataCollectionName }); });
        }
        else {
            return res.send({ error: "Could not get page data for page " + req.path });
        }
    };
    return PageDataRoutes;
}());
exports["default"] = PageDataRoutes;
