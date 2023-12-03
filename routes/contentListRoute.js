const express = require("express");
const router = express.Router();

const {getAllContent, GetContentList, GetAllContentList, GetContentById, GetArticleList, getContent, SaveArticle, saveFile, PublishArticle} = require("../controller/contentListController.js");
const { verifyAdmin } = require("../util/verifyToken.js");

router.get("/getAllContent", getAllContent);
router.get("/GetContentList/:page", GetContentList);
router.get("/GetAllContentList/:page", GetAllContentList);
router.get("/GetContentById/:contentId", GetContentById);
router.get("/SaveArticle", verifyAdmin, getAllContent);
router.get("/GetArticleList/:page", GetArticleList);
router.get("/PublishArticle", verifyAdmin, getAllContent);
router.get("/getContent", getContent);
router.post("/savefile", saveFile);
router.post("/SaveArticle", SaveArticle);
router.post("/PublishArticle", PublishArticle);



router.get("/about", function (req, res) {
    res.send("Wiki home page");
  });

module.exports = router;