// spec/serverSpec.js

var request = require('request');
var base_url = "http://ec2-52-88-237-253.us-west-2.compute.amazonaws.com:8082/";

describe("Handle routes request base url", function () {

    it("returns index.html rendered and must contain text:'API Documentation'", function(done) {
        request.get(base_url, function(error, response, body) {
            expect(body).toContain("Home Page");
            done();
        });
    });
});