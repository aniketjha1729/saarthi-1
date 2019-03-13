

// ################################################################
// Local Variables
// ################################################################

// web port
var port = 8181;


// ################################################################
// Utilities
// ################################################################

// used for debugging purposes to easily print out object data
var util = require('util');

// ################################################################
// Web Services and Middleware
// ################################################################

// express webserver service
var express = require('express');
var session = require('express-session');


// create the web app
var app = express();



// define the static resources for the splash pages
var path = require('path');
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// parses req.body
var bodyParser = require('body-parser');

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser.urlencoded({
extended: true
}));
app.use(bodyParser.json());




// ################################################################
// Handlebars to provide dynamic content in HTML pages
// ################################################################

var exphbs = require('express3-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', '.hbs');




// ################################################################
// Click-through Splash Page
// ################################################################


// serving the static click-through HTML file
app.get('/click', function (req, res) {

  // extract parameters (queries) from URL
  req.session.host = req.headers.host;
  req.session.base_grant_url = req.query.base_grant_url;
  req.session.user_continue_url = req.query.user_continue_url;
  req.session.node_mac = req.query.node_mac;
  req.session.client_ip = req.query.client_ip;
  req.session.client_mac = req.query.client_mac;
  req.session.splashclick_time = new Date().toString();

  // success page options instead of continuing on to intended url
  req.session.success_url = req.protocol + "://" + req.session.host + "/success";
  req.session.continue_url = req.query.user_continue_url;

  // display session data for debugging purposes
  console.log("Session data at click page = " + util.inspect(req.session, false, null));

  // render login page using handlebars template and send in session data
  res.render('click-through', req.session);

});

// handle form submit button and send data to Cisco Meraki - Click-through
app.post('/login', function(req, res){

  // save data from HTML form
  req.session.form = req.body.form1;
  req.session.splashlogin_time = new Date().toString();

  
    // write to console
  console.log("Session data at login page = " + util.inspect(req.session, false, null));

  
    // *** Send user to success page : success_url
  res.writeHead(302, {'Location': req.session.base_grant_url + "?continue_url="+req.session.success_url});

  res.end();

});


// ################################################################
// Sign-on Splash Page
// ################################################################

// #######
// signon page
// #######
app.get('/signon', function (req, res) {

  // extract parameters (queries) from URL
  req.session.host = req.headers.host;
  req.session.login_url = req.query.login_url;
  req.session.continue_url = req.query.continue_url;
  req.session.ap_name = req.query.ap_name;
  req.session.ap_tags = req.query.ap_tags;
  req.session.client_ip = req.query.client_ip;
  req.session.client_mac = req.query.client_mac;
  req.session.success_url = req.protocol + "://" + req.session.host + "/success";
  req.session.signon_time = new Date();
  req.session.recent_error = req.query.error_message;
  
  console.log(req.session.recent_error);

  // do something with the session and form data (i.e. console, database, file, etc. )
    // display data for debugging purposes
  console.log("Session data at signon page = " + util.inspect(req.session, false, null));

  // render login page using handlebars template and send in session data
  res.render('sign-on', req.session);

});

// #############
// success page
// #############
app.get('/success', function (req, res) {
  // extract parameters (queries) from URL
  req.session.host = req.headers.host;
  //req.session.logout_url = req.query.logout_url;
  req.session.logout_url = req.query.logout_url + "&continue_url=" + req.protocol + "://" + req.session.host + "/logout";
  req.session.success_time = new Date();

  // do something with the session data (i.e. console, database, file, etc. )
    // display data for debugging purposes
  console.log("Session data at success page = " + util.inspect(req.session, false, null));

  // render sucess page using handlebars template and send in session data
  res.render('success', req.session);
});

// #############
// logged-out page
// #############
app.get('/logout', function (req, res) {
  // determine session duration
  req.session.loggedout_time = new Date();
  req.session.duration = {};
  req.session.duration.ms = Math.abs(req.session.loggedout_time - req.session.success_time); // total milliseconds
  req.session.duration.sec = Math.floor((req.session.duration.ms/1000) % 60);
  req.session.duration.min = (req.session.duration.ms/1000/60) << 0;

  // extract parameters (queries) from URL
  req.session.host = req.headers.host;
  req.session.logout_url = req.query.logout_url + "&continue_url=" + req.protocol + "://" + req.session.host + "/logged-out";

  // do something with the session data (i.e. console, database, file, etc. )
    // display data for debugging purposes
  console.log("Session data at logged-out page = " + util.inspect(req.session, false, null));
    

  // render sucess page using handlebars template and send in session data
  res.render('logged-out', req.session);
});

// #############
// terms of service page
// #############
app.get('/terms', function (req, res) {
  res.render('terms', req.session);
});

// #############
// admin page -- lists all session data and is only enabled for demonstration purposes
// #############
app.get('/admin', function (req, res) {

  // connect
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if (err) throw err;
    console.log("Connected to Database");
    // Fetch the collection test
    var collection = db.collection('excap');
    collection.count(function(err, count) {
      console.log("There are " + count + " records.");
    });

    // report last 10 sessions
    collection.find().toArray(function(err, data) {

      /*
      console.log("Printing data from Array");
      data.forEach(function(data) {
        console.log("data from Array ");
        console.dir(data);
      });
      */

      console.log("admin mongodb session data: " + util.inspect(data, false, null));
      res.render('admin', {'data':data});
    });

  });
});

app.get('/admin2', function (req, res) {
    res.render('admin2', req.session);
});
// #############
// default home page
// #############
app.get('/', function (req, res) {
    res.render('index', req.session);
});

// ################################################################
// Start application
// ################################################################

// start web services
app.listen(process.env.PORT || port);
console.log("Server listening on port " + port);
