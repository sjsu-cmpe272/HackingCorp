if (!global.hasOwnProperty('db')) {
    var Sequelize = require('sequelize');
    var sq = null;
    var path = require('path');

    // DB Connection Variables
    var user, password, host, port, dbname;

    if (process.env.DATABASE_URL) { /* Remote database... Normally Heroku PostgreSQL running on AWS */
        console.log("We are on Heroku Database...");

        var pgregex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
        var match = process.env.DATABASE_URL.match(pgregex);
        user = match[1];
        password = match[2];
        host = match[3];
        port = match[4];
        dbname = match[5];
    }
    else if(process.env.RDS_HOSTNAME) { // Remote Database in AWS RDS - PostgreSQL
        console.log("We are on AWS RDS Database...");

        // Conf parameters for Amazon RDS
         host = process.env.RDS_HOSTNAME;
         port = process.env.RDS_PORT;
         dbname = process.env.RDS_DBNAME;
         user = process.env.RDS_USERNAME;
         password = process.env.RDS_PASSWORD;

        console.log("HOST: ",host);
        console.log("port: ",port);
        console.log("dbname: ",dbname);
        console.log("user: ",user);
        console.log("APP Port: ",process.env.PORT);
        console.log("__dirname: ",__dirname);
    }

    var config =  {
        dialect:  'postgres',
        dialectOptions: {
            ssl: true
        },
        protocol: 'postgres',
        port: port,
        host: host,
        logging: console.log
    };

    sq = new Sequelize(dbname, user, password, config);

    sq
        .authenticate()
        .then(function(err) {
            console.log('Connection has been established successfully.');
        }, function (err) {
            console.log('Unable to connect to the database:', err);
        });

    global.db = {
        Sequelize: Sequelize,
        sequelize: sq,
        User: sq.import(__dirname + '/user'),
        Goodthing: sq.import(__dirname + '/goodThing'),
        UserSetting: sq.import(__dirname + '/userSetting')
    };
}
module.exports = global.db;

