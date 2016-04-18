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
    return sequelize.define("User", {
        email: {type: DataTypes.STRING, allowNull: true},
        firstName: {type: DataTypes.STRING, allowNull: true},
        lastName: {type: DataTypes.STRING, allowNull: true},
        displayName: {type: DataTypes.STRING, allowNull: true},
        provider: {type: DataTypes.STRING, allowNull: true},
        providerID: {type: DataTypes.STRING, allowNull: true},
        photo: {type: DataTypes.STRING, allowNull: true},
        resetPasswordToken: {type: DataTypes.STRING, allowNull: true},
        resetPasswordExpires: {type: DataTypes.DATE, allowNull: true},
        password: {type: DataTypes.TEXT, allowNull: true},
        salt: {type: DataTypes.TEXT, allowNull: true},
        hash: {type: DataTypes.TEXT, allowNull: true},
        extendedToken: {type: DataTypes.TEXT, allowNull: true}
    },
        {
            classMethods: {
                createUser: function (req, callback) {
                    var _User = this;
                    hash(req.body.password, function (err, salt, hash) {
                        if (err) throw err;

                        var newUser = _User.build({
                            email: req.body.email,
                            firstName: help.getFirstName(req.body.name),
                            lastName: help.getLastName(req.body.name),
                            displayName: req.body.name,
                            provider: 'local',
                            photo: process.env.AWS_BUCKET_URL+'default.png',
                            password: hash,
                            salt: salt,
                            hash: hash
                        });

                        newUser.save().then(function (savedUser) {
                            req.login(savedUser, function (err) {
                                if(!err)
                                    callback({error:false, message:err, user:savedUser});
                            });
                        }).error(function (err) {
                            help.displayResults(err);  // Log Error to Console
                            // Should Log to file or send email to Admin
                            callback({error:true, message:err, user:savedUser});
                        });
                    });
                },
                addSocialUser: function (filteredProfile, callback) {
                    var _User = this;

                    var newUser = _User.build({
                        email: filteredProfile.email,
                        firstName: filteredProfile.firstName,
                        lastName: filteredProfile.lastName,
                        provider: filteredProfile.provider,
                        providerID: filteredProfile.id,
                        photo: filteredProfile.photo,
                        displayName: filteredProfile.displayName
                    });

                    newUser.save().then(function (savedUser) {
                        callback(savedUser);
                    }).error(function (err) {
                        help.displayResults(err);  // Log Error to Console
                        // Should Log to file or send email to Admin
                        callback(false);
                    });
                },
                userExist: function (req, callback) {
                    var _User = this;
                    _User.count({where: {email: req.body.email}}).then(function (count) {
                        if (count > 0) {
                            callback(true);
                        } else {
                            callback(false)
                        }
                    });
                },
                getUser: function (req, callback) {
                    var _User = this;
                    var userId;

                    try {
                        userId = req.user.id;
                    }
                    catch (error) {
                        userId = 0;
                    }

                    if (req.body.email) {

                        _User.findOne({
                            where: {email: req.body.email}
                        }).then(function (user) {
                            // project will be the first entry of the Projects table with the title 'aProject' || null
                            // project.title will contain the name of the project
                            callback(user);
                        })
                    } else {
                        _User.findOne({
                            where: {id: userId}
                        }).then(function (user) {
                            callback(user);
                        })
                    }
                },
                getIdFromProviderID: function (providerID, callback) {
                    var _User = this;

                    _User.findOne({
                        where: {providerID: providerID},
                        attributes: ['id']
                    }).then(function (userIdFromDb) {
                        callback(userIdFromDb);
                    }).error(function (err) {
                        help.displayResults(err);  // Log Error to Console
                        // Should Log to file or send email to Admin
                        callback(false);
                    });
                },
                getUserWithResetTokenAndExpiration: function (resetToken, callback) {
                    var _User = this;
                    _User.findOne({
                        where: {
                            resetPasswordToken: resetToken,
                            resetPasswordExpires: {$gt: Date.now()}
                        }
                    }).then(function (user) {
                        var err = null;
                        callback({error:false, message:err, user:user});
                    }).error(function (err){
                        var user = null;
                        callback({error:true, message:err, user:user});
                    });
                },
                updatePasswordAndLoginUser: function(req, password, user, callback) {
                    hash(password, function (err, salt, hash) {
                        if (err) throw err;

                        user.password = hash;
                        user.salt = salt;
                        user.hash = hash;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save().then(function (savedUser) {
                            req.login(savedUser, function (err) {
                                if(!err)
                                    callback(savedUser,err);
                            });
                        }).error(function(err) {
                            var savedUser = null;
                            callback(savedUser,err);
                        });
                    });
                },
                updatePasswordWithId: function (password,id, callback) {
                    var _User = this;
                    hash(password, function (err, salt, hash) {
                        if (err) throw err;

                        _User.update({
                            password: hash,
                            salt: salt,
                            hash: hash
                        }, {where: {id: id}})
                            .then(function (result) {
                                callback(result);
                            }).error(function (err) {
                                help.displayResults(err);  // Log Error to Console
                                callback(result);
                            });
                    });
                },
                getLoggedUserProfile: function (id, callback) {
                    var _User = this;
                    _User.findById(id).then(function (user) {
                        var err = null;
                        callback({error:false, message:err, user:user});
                    }).error(function (err){
                        var user = null;
                        callback({error:true, message:err, user:user});
                    });
                },
                updateProfileWithId: function (id, preparedUserProfile, callback) {
                    var _User = this;

                    _User.update(preparedUserProfile, {where: {id: id}}).then(function (updatedProfile) {
                            _User.findById(id).then(function (user) {
                                callback(user);
                            }).error(function (error) {
                                //Do something with error
                                callback(null);
                            });
                        }).error(function (err) {
                            help.displayResults(err);  // Log Error to Console
                            callback(false);
                        });
                },
                storeExtendedFecebookToken: function(id, token, callback){
                    var _User = this;

                    _User.update({extendedToken:token}, {where: {id: id}}).then(function (result) {
                        callback(null,result);
                    }).error(function (err) {
                        help.displayResults(err);  // Log Error to Console
                        callback(err,null);
                    });
                },
                getExtendedToken: function(id, callback){
                    var _User = this;

                    _User.findOne({
                        where: {id: id},
                        attributes: ['extendedToken']
                    }).then(function (token) {
                        callback(null, token);
                    }).error(function (err) {
                        help.displayResults(err);  // Log Error to Console
                        // Should Log to file or send email to Admin
                        callback(err, null);
                    });

                }
            }
        });
};