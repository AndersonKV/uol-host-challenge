const express = require("express");
const routes = require("./routes");

const app = express();

//set template engine
app.set("view engine", "ejs");

//static file
app.use(express.static("./public"));
app.use(express.json());
app.use(routes);

//file controllers

//listen port
app.listen(3000);
console.log("SERVER ON");
