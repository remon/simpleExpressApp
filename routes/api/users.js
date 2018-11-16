const express = require("express");

const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");
router.get("/test", function (req, res) {

    res.json({
        msg: "Users Works"
    });

});

router.post("/register", function (req, res) {

    const {
        errors,
        isValid
    } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }
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
    const {
        errors,
        isValid
    } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email
    }).then(function (user) {
        if (!user) {
            errors.email = "User Not Found"
            return res.status(404).json(errors);
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

                errors.password = "Password is incorrect , try again";
                res.status(400).json(errors);
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