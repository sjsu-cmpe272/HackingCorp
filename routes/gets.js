// routes.js
// Calls for Libraries to be used
var _ = require('underscore')               // Javascript Helper Library
    , help = require('../helper/help.js')       // Including Helper Functions
    , path = require('path');                // Handling of file paths

/* Routes to follow
 ======================*/
var index_fn = function(req, res, next) {
    var loggedUser,type;

    // Verify if user is logged using Try/Catch - If not set as "Guest"
    try {
        loggedUser = req.user.firstName;
        type = req.user.userType;
    }
    catch (error) {
        loggedUser = "Guest";
        type = "public";
    }

    // Render "index.html" and send the variable object "name" along
    res.render("index", {user:loggedUser, type:type, layout:false});
};

var login_fn = function(req, res, next) {
    var loggedUser,type;

    // Verify if user is logged using Try/Catch - If not set as "Guest"
    try {
        loggedUser = req.user.firstName;
        type = req.user.userType;
    }
    catch (error) {
        loggedUser = "Guest";
        type = "public";
    }

    // Render login.html
    res.render("login",{user:loggedUser, type:type, layout:false});
};

// Log-Out an user
var logout_fn = function(req, res, next) {
    req.logout();
    res.redirect('/');
};

var about_fn = function(req, res, next) {
    var loggedUser,type;

    // Verify if user is logged using Try/Catch - If not set as "Guest"
    try {
        loggedUser = req.user.firstName;
        type = req.user.userType;
    }
    catch (error) {
        loggedUser = "Guest";
        type = "public";
    }

    res.render("about",{user:loggedUser, type:type, layout:false});
};

var corporatedata_fn = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
        return;
    } else {
        if(req.user.userType != "manager"){
            res.redirect('/');
            return;
        }
    }

    var loggedUser,type;

    // Verify if user is logged using Try/Catch - If not set as "Guest"
    try {
        loggedUser = req.user.firstName;
        type = req.user.userType;
    }
    catch (error) {
        loggedUser = "Guest";
        type = "public";
    }

    res.render("corporatedata",{user:loggedUser, type:type, layout:false});
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
    '/corporatedata': corporatedata_fn
});

module.exports = routes;