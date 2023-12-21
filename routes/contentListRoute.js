const express = require("express");
const router = express.Router();

const {getAllContent, GetContentList, GetAllContentList, GetContentById, GetArticleList, getContent, SaveArticle, saveFile, PublishArticle} = require("../controller/contentListController.js");
const { verifyAdmin } = require("../util/verifyToken.js");

router.get("/getAllContent", getAllContent);
router.get("/GetContentList/:page", GetContentList);
router.get("/GetAllContentList/:page", GetAllContentList);
router.get("/GetContentById/:contentId", GetContentById);
router.get("/GetArticleList/:page", GetArticleList);
router.get("/getContent", getContent);
router.post("/savefile", saveFile);
router.post("/SaveArticle", verifyAdmin, SaveArticle);
router.post("/PublishArticle", verifyAdmin, PublishArticle);



router.get("/about", function (req, res) {
    res.send("Wiki home page");
  });

module.exports = router;