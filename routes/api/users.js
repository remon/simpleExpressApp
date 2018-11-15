const express = require("express");

const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

router.get("/test", function (req, res) {

    res.json({
        msg: "Users Works"
    });

});

router.post("/register", function (req, res) {
    User.findOne({
        email: req.body.email
    }, user => {
        if (user) {
            return res.status(400).json({
                email: "Email is already in DB"
            })
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: "200",
                d: "mm",
                r: "pg"
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });

        }
    })
});

router.post("/login", function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email
    }).then(function (user) {
        if (!user) {
            return res.status(404).json({
                msg: "User Not found"
            });
        }

        bcrypt.compare(password, user.password).then(function (isMatch) {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                }

                jwt.sign(payload, keys.privateOrSecret, {
                    expiresIn: 3600
                }, function (err, token) {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    })
                });
            } else {
                res.status(400).json({
                    password: "Password is incorrect , try again"
                })
            }
        });
    });
});

// protected routes for test

router.get("/current", passport.authenticate('jwt', {
        session: false
    }),
    function (req, res) {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    }
);
module.exports = router;