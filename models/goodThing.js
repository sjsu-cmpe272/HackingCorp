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
    return sequelize.define("Goodthing", {
            shortDesc: {type: DataTypes.STRING, allowNull: true},
            fullDesc: {type: DataTypes.TEXT, allowNull: true},
            date: {type: DataTypes.DATEONLY, allowNull: true},
            media: {type: DataTypes.STRING, allowNull: true},
            mediaType: {type: DataTypes.STRING, allowNull: true},
            userID: {type: DataTypes.INTEGER, allowNull: true},
            facebookFlag:{type: DataTypes.BOOLEAN, allowNull:true},
            instagramFlag:{type: DataTypes.BOOLEAN, allowNull:true},
            facebookPosted:{type: DataTypes.BOOLEAN, allowNull:true},
            instagramPosted:{type: DataTypes.BOOLEAN, allowNull:true}
        },
        {
            classMethods: {
                createGoodThing: function (goodThing, callback) {
                    var _Goodthing = this;

                    var newGoodthing = _Goodthing.build({
                        shortDesc: goodThing.shortDesc,
                        fullDesc: goodThing.fullDesc,
                        date: goodThing.gtDate,
                        media: process.env.AWS_BUCKET_URL+goodThing.gtFile,
                        mediaType: goodThing.gtMediaType,
                        userID: goodThing.userID,
                        facebookFlag: goodThing.facebookFlag,
                        instagramFlag: goodThing.instagramFlag,
                        facebookPosted: false,
                        instagramPosted: false
                    });

                    newGoodthing.save().then(function (savedGoodthing) {
                        callback(savedGoodthing);
                    }).error(function (err) {
                        help.displayResults(err);  // Log Error to Console
                        callback(false);
                    });
                },
                updateGTwithId: function (goodThing, id, callback) {
                    var _Goodthing = this;

                    _Goodthing.update(
                        {
                            shortDesc: goodThing.shortDesc,
                            fullDesc: goodThing.fullDesc,
                            date: goodThing.gtDate,
                            media: process.env.AWS_BUCKET_URL+goodThing.gtFile,
                            mediaType: goodThing.gtMediaType,
                            userID: goodThing.userID
                        } /* set attributes' value */,
                        {where: {id: id}} /* where criteria */
                    ).then(function (updatedGoodthing) {
                            _Goodthing.findById(id).then(function (gtNote) {
                                callback(gtNote);
                            }).error(function (error) {
                                //Do something with error
                                callback(null);
                            });
                        }).error(function (err) {
                            help.displayResults(err);  // Log Error to Console
                            callback(false);
                        });
                },
                getGoodThingsFromYear: function (year, userID, callback) {
                    var _Goodthing = this;
                    var dateStart = "01-01-" + year;
                    var dateEnd = "12-31-" + year;

                    _Goodthing.findAll({
                        where: {
                            userID: userID,
                            date: {
                                $between: [dateStart, dateEnd]
                            }
                        },
                        order: 'date ASC'
                    }).then(function (goodThings) {
                        //return order
                        callback(goodThings);
                    }).error(function (error) {
                        //Do something with error
                        console.log("Error!, we must do something: 'goodthings.js, line 72");
                        callback(false);
                    });
                },
                getYearsFromUser: function (userID, callback) {
                    var _Goodthing = this;

                    _Goodthing.findAll({
                        where: {
                            userID: userID
                        },
                        order: 'date ASC'
                    }).then(function (goodThings) {
                        var year, date;
                        var years = [];
                        for(var goodThing in goodThings){
                            date = goodThings[goodThing].date;
                            year = date.getFullYear();
                            if(!(years.indexOf(year) >= 0)){
                                years.push(year);
                            }
                        }
                        //return order
                        callback(years, null);
                    }).error(function (error) {
                        //Do something with error
                        console.log("Error!, we must do something: 'goodthings.js, line 72");
                        callback(null, error);
                    });
                },
                deleteGTwithID: function (id, callback) {
                    var _GoodThing = this;

                    _GoodThing.destroy({where: {id: id}}).then(function (rowsDel) {
                        callback(rowsDel, id);
                    }).error(function (error) {
                        //Do something with error
                        callback(error, id);
                    });
                },
                getGTwithID: function (id, callback) {
                    var _GoodThing = this;

                    _GoodThing.findById(id).then(function (gtNote) {
                        callback(gtNote, null);
                    }).error(function (error) {
                        //Do something with error
                        callback(null, error);
                    });
                },
                countGTforloggedUser: function(id, callback) {
                    var _GoodThing = this;

                    _GoodThing.count({where: {
                        userID: id
                    }}).then(function(count) {
                        callback(count)
                    }).error(function (error){
                       callback(0);
                    });
                },
                getLastNoteToPostToFacebook: function(id, callback) {
                    var _GoodThing = this;

                    _GoodThing.findAll({
                        where: {
                            facebookFlag: true,
                            facebookPosted: false,
                            userID: id
                        },
                        order: 'id DESC',
                        limit: 1
                    }).then(function (note) {
                        var err = null;
                        callback(err, note[0]);
                    }).error(function (err){
                        var note = null;
                        callback(err, note);
                    });
                },
                updateFacebookPostingInNote: function(id, callback) {
                    var _GoodThing = this;

                    _GoodThing.update(
                        {
                            facebookPosted: true
                        } /* set attributes' value */,
                        {where: {id: id}} /* where criteria */
                    ).then(function (result) {
                            callback(null,result);
                        }).error(function (err) {
                            help.displayResults(err);  // Log Error to Console
                            callback(err, null);
                        });
                }
            }
        });
};