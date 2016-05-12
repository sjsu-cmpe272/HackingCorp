/**
 * Created by Carlos on 11/7/15.
 */
var _ = require('underscore')   // Javascript Helper Library
    , path = require('path')    // Handling of file paths
    , help = require('../helper/help.js')       // Including Helper Functions
    , passport = require('passport');           // Library to authenticate users

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

// Signup new user (create new user)
var signup_fn = function (req, res, next) {

    global.db.User.createUser(req, function (savedUser) {
        if (savedUser.error) {
            res.send({element: "signup", id: 0, error: true, message: "Error creating new user.", redirect: false});
        } else {
            // Send user a welcome message
            help.sendWelcomeMessage(req.user.email, function(error, result){
                if(error){
                    console.log("Error Sending Email to new user: ", error);
                }
                res.status(200).json({element: "signup", id:savedUser.id, error: false, message:"New Account Created", redirect: true});
            });
        }
    });
};

// Check if user exists in DB
var checkuser_fn = function(req, res, next) {
    // Query the database to verify if user exists
    global.db.User.userExist(req, function(exist){
        if(exist) res.send({available:false});
        else res.send({available:true});
    });
};

var data_fn = function(req, res, next) {
    console.log("Req: ", req.body.table);

    switch(req.body.table) {
        case "Customers":
            global.db.Customers.getCustomersData(function (customersData) {
                if (customersData) {
                    res.render('customersData',{customers:customersData});
                } else {
                    res.send("<p>Error Retrieving Data. Please, Try Again!</p>");
                }
            });
            break;
        case "Employees":
            global.db.Employees.getEmployeesData(function (employeesData) {
                if (employeesData) {
                    res.render('employeesData',{employees:employeesData});
                } else {
                    res.send("<p>Error Retrieving Data. Please, Try Again!</p>");
                }
            });
            break;
        case "Offices":
            global.db.Offices.getOfficesData(function (officesData) {
                if (officesData) {
                    res.render('officesData',{offices:officesData});
                } else {
                    res.send("<p>Error Retrieving Data. Please, Try Again!</p>");
                }
            });
            break;
        case "Orders":
            global.db.Orders.getOrdersData(function (ordersData) {
                if (ordersData) {
                    res.render('ordersData',{orders:ordersData});
                } else {
                    res.send("<p>Error Retrieving Data. Please, Try Again!</p>");
                }
            });
            break;
        case "Orders Details":
        global.db.Orderdetails.getOrdersDetailsData(function (ordersDetailsData) {
            if (ordersDetailsData) {
                res.render('ordersDetailsData',{ordersDetails:ordersDetailsData});
            } else {
                res.send("<p>Error Retrieving Data. Please, Try Again!</p>");
            }
        });
        break;
        case "Payments":
            global.db.Payments.getPaymentsData(function (paymentsData) {
                if (paymentsData) {
                    res.render('paymentsData',{payments:paymentsData});
                } else {
                    res.send("<p>Error Retrieving Data. Please, Try Again!</p>");
                }
            });
            break;
        case "Products":
            global.db.Products.getProductsData(function (productsData) {
                if (productsData) {
                    res.render('productsData',{products:productsData});
                } else {
                    res.send("<p>Error Retrieving Data. Please, Try Again!</p>");
                }
            });
            break;
        case "Product Lines":
            global.db.Productlines.getProductLinesData(function (productLinesData) {
                if (productLinesData) {
                    res.render('productLinesData',{productLines:productLinesData});
                } else {
                    res.send("<p>Error Retrieving Data. Please, Try Again!</p>");
                }
            });
            break;
    }

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
    '/signup': signup_fn,
    '/checkuser': checkuser_fn,
    '/data': data_fn
});

module.exports = routes;