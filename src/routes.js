const express = require("express");
const Controller = require("./controllers/Controller");
const bodyParser = require("body-parser");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const routes = express.Router();

routes.get("/", Controller.index);
routes.post("/store", urlencodedParser, Controller.store);
routes.post("/getEmail", urlencodedParser, Controller.getEmail);
routes.post("/getCodiname", urlencodedParser, Controller.getCodiname);
routes.post("/list", urlencodedParser, Controller.list);

module.exports = routes;
