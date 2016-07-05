var express = require('express'),
    app = express(),
    url = require('url'),
    querystring = require('querystring'),
    bodyParser = require('body-parser'),
    request = require('request');

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
    var reqParameters = querystring.parse(url.parse(req.url).query);
    console.log(reqParameters.code);
    if (reqParameters.code) {
        var tokenUrl = 'http://54.218.78.55/users/token';
        request.post({
            url: tokenUrl,
            form: {
                code: reqParameters.code,
                client_id: 'f570f4c413c012afa53d1856a08f41390670d1724cfe7bcf5643aa90967796e2',
                client_secret: '150156b2cc1a6da37b16f7bbed109b14b32f7a2a99dc7bec764688b894c8aa59',
                redirect_uri: 'http://www.guanqunbao.com/demo-login',
                grant_type: 'authorization_code'
            }

        }, function(error, response, body) {
            if (error || !body.access_token) {
                console.log(error);
                console.log(body);
                return res.status(400).json(error);
            } else {
                console.log(body);
                request.get({
                    userInfoUrl: 'http://54.218.78.55/api/userInfo?access_token=' + body.access_token,
                }, function(error, response, body) {
                    if (error) {
                        return res.status(400).json(error);
                    } else {
                        return res.sendFile(__dirname + '/public' + '/demo2.html');
                    }
                });

            }
        });

    } else {
        return res.sendFile(__dirname + '/public' + '/demo1.html');
    }


});


app.listen(port, function() {
    console.log('app listening on port ' + port);
});
