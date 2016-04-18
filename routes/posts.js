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

// Render the Good Things
var forgot_fn = function(req, res, next) {
    //  Message to show user after reset.
    var resetMessage = "<br><br><div class='text-center'><h2><strong>A Reset email has been sent to the address provided; please follow the instructions on it to reset your password.</strong></h2></div>";

    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            global.db.User.getUser(req, function (user) {
                if (!user) {
                    res.send({element:"reset", error:true, message:resetMessage, redirect:false});
                } else {
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save().then(function (savedUser) {
                        var err = null;
                        done(err, token, savedUser);
                    }).error(function (err) {
                        var savedUser = null;
                        done(err, token, savedUser);
                    });
                }
            });
        },
        function(token, user, done) {

            // Send Reset Email
            var smtpTransport = help.getSmtpTransport();
            var mailOptions = {
                to: user.email,
                from: constants.GOOD_JAR_ADMIN_EMAIL,
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err, info) {
                if(err){
                    console.log("Error sending registration email: ", err);

                } else {
                    console.log("DONE sending registration email");
                }
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) {
            res.send({element:"reset",error:true, message:resetMessage, redirect:false});
        }
        res.send({element:"reset", error:false, message:resetMessage, redirect:false});
    });
};

var reset_token_fn = function(req, res, next) {
    var social = help.getSocialURLs();
    async.waterfall([
        function(done) {
            global.db.User.getUserWithResetTokenAndExpiration(req.params.token, function (foundUser) {
                if (foundUser.error) {
                    res.render('reset',{error:true, social: social, message:"Password reset token is invalid or has expired."});
                } else {
                    global.db.User.updatePasswordAndLoginUser(req, req.body.password, foundUser.user, function (savedUser, err) {
                        if (savedUser) {
                            done(err, savedUser);
                        } else {
                            var savedUser = null;
                            res.render('reset',{error:true, social: social, message:"An Error Ocurred reseting your password. Please, try again"});
                            done(err, savedUser);
                        }
                    });
                }
            });
        },
        function(user, done) {
            // Send Password changed confirmation email
            var smtpTransport = help.getSmtpTransport();
            var mailOptions = {
                to: user.email,
                from: constants.GOOD_JAR_ADMIN_EMAIL,
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                if(err){
                    console.log("Error sending registration email: ", err);

                } else {
                    console.log("DONE sending registration email");
                }
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
};

var message_fn = function(req, res, next) {
    // Send user a welcome message
    var smtpTransport = help.getSmtpTransport();
    var mailOptions = {
        to: constants.GOOD_JAR_INFO_EMAIL,
        from: req.body.email,
        subject: 'Guest Message',
        text: req.body.name +' wrote: '+ req.body.message
    };
    smtpTransport.sendMail(mailOptions, function(err, info) {
        if(err){
            console.log("Error sending registration email: ", err);

        } else {
            console.log("DONE sending registration email");
        }
        res.send("Email Sent");
    });
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
    '/forgot': forgot_fn,
    '/reset/:token': reset_token_fn,
    '/message': message_fn
});

module.exports = routes;