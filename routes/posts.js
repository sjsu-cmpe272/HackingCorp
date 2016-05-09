/**
 * Created by Carlos on 11/7/15.
 */
var _ = require('underscore')   // Javascript Helper Library
    , path = require('path')    // Handling of file paths
    , AWS = require('aws-sdk')                  // Library to handle storage in S3 Servers
    , fs = require('fs')                        // Handle Read and Write of files
    , help = require('../helper/help.js')    // Including Helper Functions
    , passport = require('passport')            // Library to authenticate users
    , crypto = require('crypto')
    , async = require('async')                  // Perform Asynchronous functions
    , fb = require('facebook-js')
    , constants = require('../helper/constants')
    , request = require('request');

/* POST routes
 ======================*/
// Log-in an user
var login_fn = function(req, res, next) {

    // Use Passport with a 'Local' strategy for Authentication
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            req.session.messages =  [info.message];
            res.send({element:"login", id:0, error: true, message:"Incorrect Email or Password", redirect:false});
        }

        // Redirect to login after successful authentication
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.session.messages = "";
            res.status(200).json({element:"login", id:req.user.id, error:false, message:"Login Successful", redirect:true});
        });
    })(req, res, next);
};

var data_fn = function(req, res, next) {
    console.log("Req: ", req.body.table);

    global.db.Employees.getEmployeesData(function (employeeData) {
        if (employeeData) {
            console.log(employeeData);
            res.render('presentTable',{employeeData:employeeData});
        } else {
            res.send({result: false, error: "Error Saving 'Good Thing', Please try again."})
        }
    });

    res.send("<p>Success</p>");
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
    '/login': login_fn,
    '/data': data_fn
});

module.exports = routes;