// Express Boiler-Plate

var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");

var request = require("request");
    
var app = express();

require('dotenv').load();

app.set('port', (process.env.PORT || 3000));
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set("view options", {
  layout: false
});

app.use(express.static(__dirname + "/public"));

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});