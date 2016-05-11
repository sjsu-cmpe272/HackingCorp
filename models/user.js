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
        userType: {type: DataTypes.STRING, allowNull: true},
        password: {type: DataTypes.TEXT, allowNull: true},
        salt: {type: DataTypes.TEXT, allowNull: true},
        hash: {type: DataTypes.TEXT, allowNull: true}
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
                            userType: 'manager',
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
                }
            }
        });
};