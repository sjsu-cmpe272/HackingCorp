/**
 * Created by Carlos on 11/7/15.
 */
//var db = require('../models')
    var constants = require('./constants')
    , https = require('https')              //Pretty multipart form maker
    , nodemailer = require('nodemailer')    // Send Emails within NodeJS using GMAIL and OAUTH
    , fs = require('fs')
    , exif = require('exif-parser')
    , lwip = require('lwip');

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * Taken from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
exports.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

// Print Method to display Sequelize Query Results
exports.displayResults = function(results) {
    results.forEach(function (c) {
        console.dir(c.toJSON());
    });
    console.log('------------------------------------');
};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.status(407).json({ error: 'Login Required' })
};

/**
 * Gets the first name, technically gets all words leading up to the last
 * Example: "Blake Robertson" --> "Blake"
 * Example: "Blake Andrew Robertson" --> "Blake Andrew"
 * Example: "Blake" --> "Blake"
 * @param str
 * @returns {*}
 */
exports.getFirstName = function(str) {
    var arr = str.split(' ');
    if( arr.length === 1 ) {
        return arr[0];
    }
    return arr.slice(0, -1).join(' '); // returns "Paul Steve"
}

/**
 * Gets the last name (e.g. the last word in the supplied string)
 * Example: "Blake Robertson" --> "Robertson"
 * Example: "Blake Andrew Robertson" --> "Robertson"
 * Example: "Blake" --> "<None>"
 * @param str
 * @param {string} [ifNone] optional default value if there is not last name, defaults to "<None>"
 * @returns {string}
 */
exports.getLastName = function(str, ifNone) {
    var arr = str.split(' ');
    if(arr.length === 1) {
        return ifNone || "<None>";
    }
    return arr.slice(-1).join(' ');
}

exports.getFilteredProfile = function(profile) {

    var filteredProfile = {
        displayName: profile.displayName,
        firstName: profile.firstName,
        lastName: profile.lastName,
        id:profile.id,
        email: profile.emails[0].value,
        provider: this.capitalizeFirstLetter(profile.provider)
    };

    // Handle Profile picture for LinkedIn, which use the key 'pictureUrl'
    if(profile.provider == 'linkedin'){
        filteredProfile.photo = profile._json.pictureUrl;
    } else {
        filteredProfile.photo = profile.photos[0].value;
    }

    return filteredProfile;
};

exports.getGoodThingJSONFromRequest = function (req) {
    var file = req.body.file;
    file = file.substr(file.lastIndexOf('/') + 1);

    if (file == '' || file == "" || (typeof file == 'undefined')) {
        file = "defaultMedia.jpg";
    }

    var ext = file.split('.').pop();
    var type = "image";

    switch (ext) {
        case "mov":
        case "avi":
        case "mpeg":
        case "mp4":
            type = "video"
            break;
    }

    var goodThing = {
        shortDesc: req.body.shortDesc,
        fullDesc: req.body.fullDesc,
        gtDate: req.body.date,
        gtFile: file,
        gtMediaType: type,
        userID: req.user.id
    };

    var facebookBoolean = false;
    if(req.body.facebook){
        facebookBoolean = true;
    }

    var instagramBoolean = false;
    if(req.body.instagram){
        instagramBoolean = true;
    }

    goodThing.facebookFlag = facebookBoolean;
    goodThing.instagramFlag = instagramBoolean;

    return goodThing;
}

exports.capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.prepareUserProfile = function (profile, provider, bucketURL) {

    if(provider == 'local'){
        var preparedUserProfile = {
            firstName: this.getFirstName(profile.name),
            lastName: this.getLastName(profile.name),
            displayName: profile.name,
            email: profile.email
        };
    } else {
        var preparedUserProfile = {};
    }

    // Verify if user is logged using Try/Catch - If not set as "Guest"
    try {
        if(profile.file){
            preparedUserProfile.photo = bucketURL+profile.file;
        };
    }
    catch (error) {
        console.log("No File Changed");
    }

    return preparedUserProfile;
};

exports.getSocialURLs = function(){
    var social = {
        facebook: constants.FACEBOOK_SOCIAL_URL,
        twitter: constants.TWITTER_SOCIAL_URL,
        youtube: constants.YOUTUBE_SOCIAL_URL,
        instagram: constants.INSTAGRAM_SOCIAL_URL
    };

    return social;
};

exports.fbConfig = function(){
    var config;

    config = {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: constants.FACEBOOK_AUTHORIZATION_CALLBACK_URL,
        scope: 'publish_actions',
        grant_type: 'client_credentials'
    };

    return config;
};

exports.updatePostingInNote = function(id, callback){
    global.db.Goodthing.updateFacebookPostingInNote(id, function(error, result){
        if(error) {
            console.log("Error Updating Facbook post: ",error);
            callback(error, null);
        } else {
            callback(null, result);
        }
    });
};

exports.postToFacebook = function(id, access_token, fb, callback){
    _This = this;

    global.db.Goodthing.getLastNoteToPostToFacebook(id, function(error, note){
        if(!error){
            // Check what type of media
            var mediaURL = note.media
            mediaURL = mediaURL.substr(mediaURL.lastIndexOf('/') + 1);

            // Prepare Message
            var message = constants.SOCIAL_NETWORKS_MESSAGE+note.fullDesc;

            if(mediaURL != "defaultMedia.jpg"){
                if(note.mediaType == 'image') {
                    // GTNote with Image
                    fb.apiCall('POST', '/me/photos', {
                            access_token: access_token,
                            message: message,
                            url: note.media
                        },
                        function (error, response, body) {
                            if(body.error) console.log("Error Posting to Facebook: ",error);
                            _This.updatePostingInNote(note.id, function(error, result){
                                callback();
                            });
                        }
                    );
                } else {
                    // GTNote with Video
                    fb.apiCall('POST', '/me/videos', {
                            access_token: access_token,
                            description: message,
                            file_url: note.media
                        },
                        function (error, response, body) {
                            if(body.error) console.log("Error Posting to Facebook: ",error);

                            _This.updatePostingInNote(note.id, function(error, result){
                                callback();
                            });
                        }
                    );
                }
            } else {
                // GTNote Text Only
                fb.apiCall('POST', '/me/feed', {
                        access_token: access_token,
                        message: message
                    },
                    function (error, response, body) {
                        if(body.error) console.log("Error Posting to Facebook: ",error);

                        _This.updatePostingInNote(note.id, function(error, result){
                            callback();
                        });
                    }
                );
            }
        } else {
            console.log("Error finding last post in facebook");
            callback();
        }
    });
};

exports.sendWelcomeMessage = function(email, callback){
    // Send user a welcome message
    var smtpTransport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_SMTP_PORT,
            secure: true, // use SSL
            auth: {
                user: constants.GOOD_JAR_ADMIN_EMAIL,
                pass: process.env.EMAIL_PASS
            }
    },
        {
        // default message fields
        // sender info
        from: 'Good Things Jar <'+constants.GOOD_JAR_ADMIN_EMAIL+'>',
        headers: {
            'X-Laziness-level': 1000 // just an example header, no need to use this
        }
    });
    var mailOptions = {
        to: email,
        bcc: constants.GOOD_JAR_ADMIN_EMAIL,
        from: constants.GOOD_JAR_ADMIN_EMAIL,
        subject: 'Welcome to the Good Things Jar!',
        text: 'Welcome to the Good Things Jar, where good things happens!\n\n' +
        'Write simple notes of the Good Things that happened, and put them in your virtual Jar; See the content of your Jar to remind yourself ' +
        'of those Good Things!\n\n' +
        'If you have any question, write us at '+constants.GOOD_JAR_INFO_EMAIL+'.\n\n' +
        'Thanks,\n\n'+
        'Good Things Jar Team.\n'
    };
    smtpTransport.sendMail(mailOptions, function(err, info) {
        if(err){
            console.log("Error sending registration email: ", err);

        } else {
            console.log("DONE sending registration email");
        }
        callback(err,info);
    });
};

exports.getSmtpTransport = function() {
    var smtpTransport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_SMTP_PORT,
            secure: true, // use SSL
            auth: {
                user: constants.GOOD_JAR_ADMIN_EMAIL,
                pass: process.env.EMAIL_PASS
            }
        },
        {
            // default message fields
            // sender info
            from: 'Good Things Jar <' + constants.GOOD_JAR_ADMIN_EMAIL + '>',
            headers: {
                'X-Laziness-level': 1000 // just an example header, no need to use this
            }
        });

    return smtpTransport;
};

exports.removeExif = function(data, filename){
    // remove exif from jpeg files
    var picExt = filename.split('.').pop().toLowerCase();
    if(picExt == 'jpeg'){
        data = data.toString("binary");
        data = piexif.remove(data);
        data = new Buffer(data, "binary");
    }
    return data;
};

exports.correctOrientation = function(data, filename, callback){
    // remove exif from jpeg files
    var exifData = false;
    var picExt = filename.split('.').pop();
    console.log("File Extension: ", picExt);
    console.log("File Data: ",data);
    var picExtLower = picExt.toLowerCase();

    if(picExtLower == 'jpeg' || picExtLower == 'jpg' || picExtLower == 'tiff' || picExtLower == 'tif') {
        // Get exif Data - to re-orient image
        exifData = exif.create(data).parse();

        // Compare and re-orient image
        lwip.open(data, picExt, function (err, image) {
            if (err) throw err;
            if (exifData) {
                switch (exifData.tags.Orientation) {
                    case 2:
                        image = image.batch().flip('x'); // top-right - flip horizontal
                        break;
                    case 3:
                        image = image.batch().rotate(180); // bottom-right - rotate 180
                        break;
                    case 4:
                        image = image.batch().flip('y'); // bottom-left - flip vertically
                        break;
                    case 5:
                        image = image.batch().rotate(90).flip('x'); // left-top - rotate 90 and flip horizontal
                        break;
                    case 6:
                        image = image.batch().rotate(90); // right-top - rotate 90
                        break;
                    case 7:
                        image = image.batch().rotate(270).flip('x'); // right-bottom - rotate 270 and flip horizontal
                        break;
                    case 8:
                        image = image.batch().rotate(270); // left-bottom - rotate 270
                        break;
                    default:
                        image = null;
                        break;
                }
                if(image) {
                    console.log("Image object available...")
                    image.toBuffer("jpg", function (err, imageBuffer) {
                        console.log("Transforming to Buffer, and returning...")
                        callback(imageBuffer);
                    });
                } else {
                    // Nothing done to the image; therefore return original object.
                    console.log("Exif available, but correct orientation. Return original object...")
                    callback(data);
                }
            } else {
                // No Exif Data, therefore return original object -- Nothing to do here
                console.log("JPEG, but not exif data; returning original object...")
                callback(data);
            }
        });

    } else {
        // Do nothing and return the data object un-altered.
        console.log("No JPEG; returning original object...")
        callback(data);
    }
};