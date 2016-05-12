/*
// spec/serverSpec.js

var request = require('request');
var base_url = "http://ec2-52-88-237-253.us-west-2.compute.amazonaws.com:8082/";

describe("Handle routes request base url", function () {

    it("returns indexOriginal.html rendered and must contain text:'API Documentation'", function(done) {
        request.get(base_url, function(error, response, body) {
            expect(body).toContain("Home Page");
            done();
        });
    });
});*/
var request = require('request');
var hackingCorp =require("../app.js")
//var base_url = "http://ec2-52-88-237-253.us-west-2.compute.amazonaws.com:8082/";
var base_url = "http://localhost:8081/";




describe("Index.html must contain Hacking Corp", function() {

    describe("test to http request", function() {

        describe("GET /", function() {
            it("returns status code 200", function(done) {
                request.get(base_url, function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    //console.log(expect(response.statusCode).toBe(200));
                    done();

                });


            });
            it("tests Hacking Corp",function(done){
                request.get(base_url, function(error, response, body) {
                    expect(body).toContain("Hacking Corp.");
                    // console.log(expect(response.statusCode).toBe(200));
                    done();

                });

            });

        });

    });
    var str = "Hacking Corp.";

    // it("Hacking Corp", function (done) {
    //     request.get(base_url, function (error, response, body) {
    //         console.log("Test");
    //         browser.getCurrentUrl().then(function (actualUrl) {
    //             return url != actualUrl;
    //             done();
    //         });
    //
    //     });
    //
    // });


    var getCode = function (code, url) {
        if (code = (new RegExp('[?&]' + encodeURIComponent(code) + '=([^&]*)'))
                .exec(url))
            return decodeURIComponent(code[1]);
    };


    it("check the code value of url", function () {
        var url = "https://test.com?&code=testParam";
        var code = getCode("code", url);
        expect(code).toEqual("testParam");
    });



});


