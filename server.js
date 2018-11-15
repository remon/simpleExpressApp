const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const db = require("./config/keys.js").mongoURI;
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const bodyParser = require("body-parser");
const passport = require("passport");


// app use

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

mongoose.connect(db)
    .then(() => console.log("connected to DB"))
    .catch(err => console.log(err));

//passport middleware

app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//routers
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.listen(port, () => console.log("Server is online now "));