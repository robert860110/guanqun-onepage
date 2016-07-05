var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var port = 3000;


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public' + '/index.html');
});

app.get('/demo-login', function(req, res) {
    res.sendFile(__dirname + '/public' + '/demo1.html');
});


app.listen(port, function() {
    console.log('app listening on port ' + port);
});
