const express = require("express");

const router = express.Router();


router.get("/test", function (req, resp) {

    resp.json({
        msg: "Users Works"
    });

});
module.exports = router;