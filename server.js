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

app.get('/thesaurus_api', function (req, res, next) {
	var word = req.query.word;
	request({
		uri: 'http://words.bighugelabs.com/api/2/' + process.env.API_KEY + '/' + word + '/json',
		method: 'GET',
		json: true
	}, function (error, response, body) {
		if (error) res.status(500).send({error: "Internal Server Error"});
		if (!body) res.status(500).send(word + " was not found.");
		res.send(body);
	});
});