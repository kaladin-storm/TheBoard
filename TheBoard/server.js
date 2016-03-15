var http = require("http");
var express = require("express");
var controllers = require("./controllers"); //picks index by default
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");

var app = express();
app.set("view engine", "vash");

//map the routes
controllers.init(app);

//Opt into services
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()) //cannot get bodyparsser working
app.use(cookieParser());
app.use(session({ secret: "theboard" })); //secret is to scramble the date
app.use(flash());


//set public static resource folder
app.use(express.static(__dirname + "/public"));

//creating a web server
var server = http.createServer(app);

server.listen(3000);