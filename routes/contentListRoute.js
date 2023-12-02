const express = require("express");

const router = express.Router();

const {getAllContent} = require("../controller/contentListController.js");

router.get("/getAllContent", getAllContent);

router.get("/GetContentList/:page", getAllContent);


router.get("/about", function (req, res) {
    res.send("Wiki home page");
  });

module.exports = router;