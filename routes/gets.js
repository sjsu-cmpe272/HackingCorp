// routes.js
// Calls for Libraries to be used
var _ = require('underscore')               // Javascript Helper Library
    , path = require('path')                // Handling of file paths
    , help = require('../helper/help.js')   // Including Helper Functions
    , passport = require('passport')       // Library to authenticate users
    , constants = require('../helper/constants')
    , fb = require('facebook-js')
    , graph = require('fbgraph');

/* Routes to follow
 ======================*/
var index_fn = function(req, res, next) {
    var loggedUser;

    // Verify if user is logged using Try/Catch - If not set as "Guest"
    try {
        loggedUser = req.user.firstName;
    }
    catch (error) {
        loggedUser = "Guest";
    }

    // Render "index.html" and send the variable object "name" along
    res.render("index", {user:loggedUser,layout:false});
};

var login_fn = function(req, res, next) {
    // Render login.html
    res.render("login");
};

// Log-Out an user
var logout_fn = function(req, res, next) {
    req.logout();
    res.redirect('/');
};

var about_fn = function(req, res, next) {
    res.render("about");
};

var corporatedata_fn = function(req, res, next) {
    res.render("corporatedata");
};

var account_fn = function(req, res, next) {
    help.ensureAuthenticated(req,res,next);
    res.render('account', { user: req.user });
};

// Facebook Login Strategy
var auth_facebook_fn = passport.authenticate('facebook' ,{scope:['email']});

var auth_facebook_callback_fn = [
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res, next) {
        res.redirect('/');
    }
];

var facebook_authorization_fn = function (req, res, next) {

    var URL = fb.getAuthorizeUrl({
        client_id: process.env.FACEBOOK_APP_ID,
        redirect_uri: constants.FACEBOOK_AUTHORIZATION_CALLBACK_URL,
        scope: 'publish_actions'
    });


    res.send(URL);
};

// user gets sent here after being authorized
var user_has_logged_in_fn = function (req, res,next) {
    console.log("Redirected");
};

var facebook_authorization_callback_fn = function (req, res, next) {
    var validToken;     // Variable to store the Facebook Token
    if(!req.params.token) {
        fb.getAccessToken(process.env.FACEBOOK_APP_ID, process.env.FACEBOOK_APP_SECRET, req.query.code, constants.FACEBOOK_AUTHORIZATION_CALLBACK_URL, function (error, access_token, refresh_token) {
            if(access_token) {
                // Set Token in Graph object
                graph.setAccessToken(access_token);

                // extending specific access token
                graph.extendAccessToken({
                    "access_token": access_token
                    , "client_id": process.env.FACEBOOK_APP_ID
                    , "client_secret": process.env.FACEBOOK_APP_SECRET
                }, function (err, facebookRes) {
                    if (!err) {
                        global.db.User.storeExtendedFecebookToken(req.user.id, facebookRes.access_token, function (error, result) {
                            if (!error) {
                                console.log("Success Storing Extended Token");
                            } else {
                                // Error Storing Extended Facebook Token
                                console.log("Error Storing Extended Facebook Token: ", error);
                            }
                            // Call Helper Function to Post to Facebook with Extended Token
                            help.postToFacebook(req.user.id, facebookRes.access_token, fb, function () {
                                res.redirect('/');
                            });
                        });
                    } else {
                        // Call Helper Function to Post to Facebook with regular Token
                        help.postToFacebook(req.user.id, access_token, fb, function () {
                            res.redirect('/');
                        });
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    } else {
        // Assign the passed parameter to variable
        validToken = req.params.token;

        // Call Helper Function to Post to Facebook with Extended Token
        help.postToFacebook(req.user.id,validToken,fb, function(){
            res.redirect('/');
        });
    }
};

/* Map Routes
 ======================*/
var define_routes = function(dict) {
    var toroute = function(item) {
        return _.object(_.zip(['path', 'fn'], [item[0], item[1]]));
    };

    return _.map(_.pairs(dict), toroute);
};


/* Define Routes
 ======================*/
var routes = define_routes({
    '/': index_fn,
    '/login': login_fn,
    '/logout': logout_fn,
    '/about': about_fn,
    '/corporatedata': corporatedata_fn,
    '/account': account_fn,
    '/auth/facebook': auth_facebook_fn,
    '/auth/facebook/callback': auth_facebook_callback_fn,
    '/facebook/authorization': facebook_authorization_fn,
    '/facebook/authorization/callback': facebook_authorization_callback_fn,
    '/facebook/authorization/callback/:token': facebook_authorization_callback_fn,
    '/userhasloggedin':user_has_logged_in_fn
});

module.exports = routes;