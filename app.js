/**
 * api/app.js
 * exports an express app started.
 */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

process.env.JWT_KEY = "thisIsMyJwtKeyUsedToEncodeTheTokens";

//middleware to parse requests of extended urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//middleware to parse requests of content-type - application/json
app.use(bodyParser.json());

//import router with endpoints definitions
const routes = require("./api/routes");
//attach router as a middleware
app.use(routes);

//endpoints
app.get("/", (req, res) => {
  res.send({ message: "Yabadabadooo" });
});

module.exports = app;
