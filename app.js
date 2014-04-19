//dependencies for each module used
var express   = require('express')
  , graph     = require('fbgraph')
  , app       = module.exports = express.createServer();
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();

//load environment variables
var dotenv = require('dotenv');
dotenv.load();

//route files to load
var index = require('./routes/index');
var loggedIn = require('./routes/loggedIn');

//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);
var conf = {
	client_id: process.env.facebook_app_id
  , client_secret: process.env.facebook_app_secret
  , scope: 'email, user_about_me, user_activities, read_stream'
  , redirect_uri: 'http://natjianfriends.herokuapp.com/auth/facebook'
};

//Configures the Template engine
app.configure(function() {
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//Routes

app.get('/', index.view);

app.get('/auth/facebook', function(req, res) {
  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
    graph.get("/me/likes", function(err, res) {
    console.log(res);
    });
    
    //Store user data after stringfying it
    //Log returned data

    //Return data to the webpage
     res.render('loggedIn', {res: 'Dumb and Dumber'});
   // res.redirect('/loggedIn');
  });

});

//dependency for twitter oAuth
var Twit = require('twit');

var T = new Twit({
    consumer_key: 'dotenv.consumer_key'
  , consumer_secret: 'dotenv.consumer_secret'
  , access_token: 'dotenv.access_token'
  , access_token_secret: 'dotenv.access_token_secret'
});

app.get('/loggedIn', loggedIn.getStatuses);

// user gets sent here after being authorized
app.get('/loggedIn', loggedIn.view);
app.post('/loggedIn', loggedIn.view);
app.post('/', index.view);
app.post('/auth/facebook/canvas', graph.authorize);
//app.get('/loggedIn', loggedIn.userinfo);


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

//***************AUTHENTICATION*******************//



/*//add twitter api setup
var g
ig.set('client_id', process.env.twitter_app_id);
ig.set('client_secret', process.env.twitter_app_secret);

//export ig as a parameter to be used by other methods that require it.
exports.ig = ig;*/