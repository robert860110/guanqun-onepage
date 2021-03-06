var express = require('express'),
    app = express(),
    url = require('url'),
    querystring = require('querystring'),
    bodyParser = require('body-parser'),
    request = require('request'),
    expressSession = require('express-session');

var port = 3000;


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressSession({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));
app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public' + '/index.html');
});

app.get('/demo-login', function(req, res) {
    var reqParameters = querystring.parse(url.parse(req.url).query);
    if (reqParameters.code) {
        var tokenUrl = 'http://54.218.78.55/user/token';
        request.post({
            url: tokenUrl,
            form: {
                code: reqParameters.code,
                client_id: 'c4ed7f4eca8767f4da3e42b733ced040',
                client_secret: 'ab6bd0fb229ea7375b049f3f56cae92c',
                redirect_uri: 'http://www.guanqunbao.com/demo-login',
                grant_type: 'authorization_code'
            }
        }, function(error, response, body) {
            var bodyObject = JSON.parse(body);
            if (error || !bodyObject.access_token) {
                console.log(error);
                return res.status(400).json(error);
            } else {
                userInfoUrl = 'http://54.218.78.55/api/user?access_token=' + bodyObject.access_token;
                console.log(userInfoUrl);
                request(userInfoUrl, function(error, response, body) {
                    if (error) {
                        console.log(error);
                        return res.status(400).json(error);
                    } else {
                        console.log(body);
                        var bodyObject = JSON.parse(body);
                        req.session.userInfo = bodyObject;
                        return res.sendFile(__dirname + '/public' + '/demo2.html');
                    }
                });
            }
        });

    } else {
        return res.sendFile(__dirname + '/public' + '/demo1.html');
    }

});

app.get('/userInfo', function(req, res) {
    return res.json(req.session.userInfo);
});

app.listen(port, function() {
    console.log('app listening on port ' + port);
});
