/**
 * Created by Tech-team on 11/4/15.
 */
/* Object/Relational mapping for instances of the Users class.
 - classes correspond to tables
 - instances correspond to rows
 - fields correspond to columns
 In other words, this code defines how a row in the postgres order table
 maps to the JS Order object.
 */
var hash = require('../authentication/passencrypt').hash
    , help = require('../helper/help.js');   // Including Helper Functions

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("UserSetting", {
            userID: {type: DataTypes.INTEGER, allowNull: false},
            writeGTAfterlogin: {type: DataTypes.BOOLEAN, allowNull: false}
        },
        {
            classMethods: {
                initializeUserSettings: function (userSettingsJSON, callback) {
                    var _UserSettings = this;

                    var newUserSettings = _UserSettings.build({
                        userID: userSettingsJSON.userID,
                        writeGTAfterlogin: userSettingsJSON.writeGTAfterlogin
                    });

                    newUserSettings.save().then(function (savedUserSettings) {
                        callback(savedUserSettings);
                    }).error(function(err) {
                        help.displayResults(err);  // Log Error to Console
                        // Should Log to file or send email to Admin
                        callback(false);
                    });
                },
                readSetting: function(settingName, req, callback) {
                    var _UserSettings = this;

                    _UserSettings.findOne({
                        where: {userID: req.user.id},
                        attributes: [settingName]
                    }).then(function(user){
                        callback(user);
                    }).error(function(err) {
                        help.displayResults(err);  // Log Error to Console
                        // Should Log to file or send email to Admin
                        callback(false);
                    });
                },
                readAllSettings: function(req, callback) {
                    var _UserSettings = this;

                    _UserSettings.findOne({where: {userID: parseInt(req.user.id)}}).then(function(settings){
                        callback(settings);
                    }).error(function(err) {
                        help.displayResults(err);  // Log Error to Console
                        // Should Log to file or send email to Admin
                        callback(false);
                    });
                },
                writeSetting: function(settingName, settingValue, userID, callback) {
                    var _UserSettings = this;

                    sequelize.query('UPDATE "UserSettings" AS "UserSetting" SET "'+settingName+'" = '+settingValue+' WHERE "UserSetting"."userID" = :userID', { replacements: {
                        userID: userID
                    }}).spread(function(results, metadata) {
                        // Results will be an empty array and metadata will contain the number of affected rows.
                        callback(metadata);
                    });

                }
            }
        });
};