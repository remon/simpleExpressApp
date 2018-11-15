const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.privateOrSecret;
module.exports = function (passport) {

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        //console.log(jwt_payload);

        User.findById(jwt_payload.id)
            .then(function (user) {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            }).catch(function (err) {
                console.log(err);
            });
    }));
};