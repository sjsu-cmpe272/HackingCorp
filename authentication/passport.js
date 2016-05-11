/**
 * Created by Carlos on 11/25/15.
 */
var LocalStrategy = require('passport-local').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , hash = require('../authentication/passencrypt').hash
    , help = require('../helper/help.js')
    , constants = require('../helper/constants');   // Including Helper Functions

module.exports = function (passport, db) {

    // Serialize
    passport.serializeUser(function (user, done) {
        console.log("Serializing !!");
                done(null, user);
    });

    // Deserialize
    passport.deserializeUser(function (user, done) {
        console.log("Deserializing user: " + user);
        /* { where: {id:id} }  */
        done(null, user);
    });

    // Local-Strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',     // Use email instead of the default username field
            passwordField: 'password'   // same as default
        },
        function (username, password, done) {
            var User = db.User;

            User.find({where: {email: username}}).then(function (user) {
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }

                hash(password, user.salt, function (err, hash) {
                    if (err) {
                        return done(err);
                    }
                    if (hash != user.hash) {
                        return done(null, false, {message: 'Incorrect password.'});
                    }
                    else {
                        console.log("PassWord and UserName Correct");
                        return done(null, user);
                    }
                });
            }).error(function (err) {
                console.log(err + ":Error looking for Username :( ");
                return done(err);
            });
        }
    ));
<<<<<<< HEAD
=======

    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            //clientID: "922259717867972",
           // clientSecret: "5e2f4fa07fnfb5118528eb8e3fe4efe8ba",
            callbackURL: process.env.BASE_URL+"/auth/facebook/callback",
            profileFields: ['email', 'name', 'displayName', 'photos']
        },
        function (accessToken, refreshToken, profile, done) {

            var User = global.db.User;
            var filteredProfile = help.getFilteredProfile(profile);

            User.find({where: {providerID: filteredProfile.id, provider: filteredProfile.provider}}).then(function (user) {
                if (user) {
                    // User Found in Database; nothing to do...
                    return done(null, profile);
                } else {
                    // User not in Database, we need to create new record
                    global.db.User.addSocialUser(filteredProfile, function (savedUser) {
                        help.sendWelcomeMessage(filteredProfile.email, function(error,result){
                            if(error){
                                console.log("Error Sending Welcome message: ",error);
                            }
                            return done(null, profile);
                        });
                    });
                }
            }).error(function (err) {
                help.displayResults(err);  // Log Error to Console
                return done(err);
            });
        }
    ));
>>>>>>> aad1e5bfe27fc98e676a22271eac43402ae8edcf
};