var http = require("http");
var express = require("express");
var controllers = require("./controllers"); //picks index by default
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");

var app = express();
app.set("view engine", "vash");

//use authentication
var auth = require("./auth/index.js");
auth.init(app);

//map the routes
controllers.init(app);

//Opt into services
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()) //cannot get bodyparsser working
app.use(cookieParser());
app.use(session({ secret: "theboard" , maxAge: 360 * 5})); //secret is to scramble the date
app.use(flash());


//set public static resource folder
app.use(express.static(__dirname + "/public"));

app.get("/api/sql", function (req, res) {
    var msnodesql = require("msnodesql");
    var connString = "Driver={SQL Server Native Client 11.0};Server=.\\sqlexpress12;Database=Northwind;Trusted_Connection={Yes}";
    
    msnodesql.query(connString, "SELECT * FROM Customers WHERE CustomerID = 'ALFKI'", function (err, results) {
        // Error Handling
        res.send(results);
    });
});

//creating a web server
var server = http.createServer(app);

server.listen(3000);

//socket io
var updater = require("./updater");
updater.init(server);