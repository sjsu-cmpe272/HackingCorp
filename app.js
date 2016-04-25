// Basic setup for NodeJS server

/* Libraries and Packages - Dependencies
 =======================================*/
var express = require('express')                // Node Framework
    , bodyParser = require('body-parser')       // Parse body of REST Requests
    , app = express()                           // Define app variable
    , port = process.env.PORT || 8081           // Define port the app will be using
    , http = require('http')		            // Require http server
    , path = require('path')                    // Handling of file paths
    , gets = require('./routes/gets')           // Define routes path
    , posts = require('./routes/posts')         // Define routes path
    , db = require('./models')                  // Set Path to the database model directory and definition
    , async = require('async')                  // Perform Asynchronous functions
    , passport = require('passport')            // Library to authenticate users
    , serveStatic = require('serve-static')     // Serve Static Files
    , busboy = require('connect-busboy')        // For Multi-part file upload
    , favicon = require('serve-favicon');       // Display Favicon on site

/* VIEW ENGINE - EJS
 set the view engine to ejs - View Templates to integrate Javascript with HTML
 ==================*/
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

/* Midlewares
 ================*/
app.use(bodyParser.urlencoded({ extended: true, limit: '6mb' }));       // configure "app" to use bodyParser() to handle date from POST
app.use(bodyParser.json());                             // define parse format - JSON
app.use('/public',serveStatic(__dirname + '/public/')); // Serve Static Files
app.use(require('cookie-parser')());                    // Enable Cookies on App
app.use(require('express-session')({                    // Enable a User Session for persistence
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true }));
app.use(passport.initialize());                         // Initialize Passport Libraries for Authentication
app.use(passport.session());                            // Create a new session with Passport
app.use(busboy());                                      // Define busboy to handle file uploads

/* Passport route for Authentication
 ================*/
require('./authentication/passport')(passport, global.db);
/* ROUTES  -  GET
 ================*/
for(var get in gets) {
    app.get(gets[get].path, gets[get].fn);
}

/* ROUTES - POSTS
 ================*/
for(var post in posts) {
    app.post(posts[post].path, posts[post].fn);
}

/* Start Server
 ================*/
// Begin listening for HTTP requests to Express app
global.db.sequelize.sync().then(function(err) {

    async.parallel([
        function () {
            // Begin listening for HTTP requests to Express app
            http.createServer(app).listen(port, function () {
                console.log("Listening on " + port);
            });
        }
    ]);
});
