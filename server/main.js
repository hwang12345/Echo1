import { Meteor } from 'meteor/meteor';
import '../imports/api/users.js';
import '../imports/api/guests.js';

var fs = require( 'fs' );

Meteor.startup(() => {
  // code to run on server at startup
});



// exports a RESTful API for browser
HTTP.methods({

    // name RESTful API as "GET /download-meteor-logo"
    '/backgroundImage': function() {

        // A file in streaming, so need to response to browser as a streaming.
        var res = this.createWriteStream();

        // Play as a HTTP client for requesting image.
        // It is Sync way
        var result = fs.readFileSync("D:/meteor/Echo1/imports/img/backgroundImageps.png");

        var buffer = result;
        // TODO: need to set header for response here which transfered by
        // response of logo request.
        res.write(buffer);
        res.end();
    },

    '/data': function() {

        // A file in streaming, so need to response to browser as a streaming.
        var res = this.createWriteStream();

        // Play as a HTTP client for requesting image.
        // It is Sync way
        var result = fs.readFileSync("D:/meteor/Echo1/imports/data/demo-data.json");

        var buffer = result;
        // TODO: need to set header for response here which transfered by
        // response of logo request.
        res.write(buffer);
        res.end();
    },
});
// Meteor.isServer enclosure