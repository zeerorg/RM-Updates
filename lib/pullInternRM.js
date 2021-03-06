const request = require('request');

const hashCode = require('./hashCode');
const rmConfig = require('../config/rmConfig');
const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const newsInternRef = database.ref('internNews/');

module.exports = function () {
    request(rmConfig.internNewsFeedUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Intern Notifications loaded OK!");
            result = JSON.parse(body);
            for (let i = 0; i < result.length; i++) {
                let key = hashCode(
                    result[i].date +
                    result[i].time +
                    result[i].header +
                    result[i].body.substr(0, 5));

                newsInternRef.child(key).child("notification").set({
                    date: result[i].date,
                    time: result[i].time,
                    header: result[i].heading,
                    body: result[i].body,
                    poster: result[i].poster
                });
            }
        } else if (response) {
            console.log(response.statusCode);
        } else {
            console.error(error);
        }
    });
}