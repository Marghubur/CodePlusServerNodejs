const db = require("../db.config");
const contentlist = db.contentlist;
const fileUpload = require('express-fileupload');
const path = require('path');
const util = require("../util/util.js")

const getContent = async (req, res) => {
    res.send({msg: __dirname + ": " + process.cwd()});
};

const getAllContent = async (req, res) => {
    try {
        
        contentlist.findAll().then(data => {
            console.log("Hit user");
            const responseData = {
                StatusMessage: 'success',
                ResponseBody: data,
                StatusCode: 200
              };
            res.status(200).json(responseData);
        })
    } catch (error) {   
        res.status(500).send(error.message);
    }
};

const GetContentList = async (req, res) => {
    try {
        const page =  req.params.page; // Get the page from the query parameters, default to page 1
        const limit = 10; // Number of items per page
        const offset = (page - 1) * limit;
        contentlist.findAll({
            where : {
                IsPublish: true
            }
        }).then(data => {
            var result = data.splice(offset, limit);
            const responseData = {
                StatusMessage: "Success",
                ResponseBody: result,
                StatusCode: 200
              };
            res.status(200).json(responseData);
        })
    } catch (error) {   
        res.status(500).send(error.message);
    }
};

const GetAllContentList = async (req, res) => {
    try {
        const page =  req.params.page; // Get the page from the query parameters, default to page 1
        const limit = 10; // Number of items per page
        const offset = (page - 1) * limit;
        contentlist.findAll().then(data => {
            var result = data.splice(offset, limit);
            const responseData = {
                StatusMessage: "Success",
                ResponseBody: result,
                StatusCode: 200
              };
            res.status(200).json(responseData);
        })
    } catch (error) {   
        res.status(500).send(error.message);
    }
};

const GetContentById = async (req, res) => {
    try {
        const id =  req.params.contentId; 
        contentlist.findByPk(id).then(data => {
            const responseData = {
                StatusMessage: "Success",
                ResponseBody: data,
                StatusCode: 200
              };
            res.status(200).json(responseData);
        })
    } catch (error) {   
        res.status(500).send(error.message);
    }
};

const GetArticleList = async (req, res) => {
    try {
        const page =  req.params.page; // Get the page from the query parameters, default to page 1
        const limit = 10; // Number of items per page
        const offset = (page - 1) * limit;
        contentlist.findAll({
            where : {
                IsPublish: true,
                IsArticle: true
            }
        }).then(data => {
            var result = data.splice(offset, limit);
            const responseData = {
                StatusMessage: "Success",
                ResponseBody: result,
                StatusCode: 200
              };
            res.status(200).json(responseData);
        })
    } catch (error) {   
        res.status(500).send(error.message);
    }
};

const SaveArticle = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
    
        const uploadedFile = req.files.file;
        const text = req.body.article;
        var user = JSON.parse(text);
        var imgpath = util.saveFile("article", uploadedFile, user.Type + "_"+ user.Part, null);
        if (!imgpath) 
            return res.status(500).send("Fail to save image");
        
        user.ImgPath = imgpath;
        var filepath = util.saveTxtFile("article", user.BodyContent, user.Type + "_"+ user.Part);
        if (!filepath)
            return res.status(500).send("Fail to generate text file");
        
        user.FilePath = filepath;
        var result = null;
        if (user.ContentId == 0)
            result =  createArticle(user);
        else
            result = updateArticle(user);

        return res.status(200).json(result);
    } catch (error) {   
        res.status(500).send(error.message);
    }
};

const createArticle = async (contentDetail) => {
    try {
        var lastContent = await contentlist.findOne({
            order: [["ContentId", "DESC"]]
        });
        var contentId = 1;
        if (lastContent) {
            contentId = lastContent.ContentId + 1;
        } 
        contentDetail.ContentId = contentId;
        contentDetail.IsPublish = false;
        if (contentDetail.AllTags != null && contentDetail.AllTags.length > 0)
            contentDetail.Tags = JSON.stringify(contentDetail.AllTags);
        else
            contentDetail.Tags = "[]";
        contentDetail.SaveOn = new Date();
        await contentlist.create(contentDetail);
        return contentObj;
    } catch (error) {
        return (error);
    }
}

const updateArticle = async (contentDetail) => {
    try {
        var content = await contentlist.findByPk(contentDetail.ContentId);
        if (!content)
            return "record not found";

        // content.Part = contentDetail.Part;
        // content.Type = contentDetail.Type;
        // content.Detail = contentDetail.Detail;
        // content.IsArticle = contentDetail.IsArticle;
        // content.ImgPath = contentDetail.ImgPath;
        // content.Title = contentDetail.Title;

        contentDetail.ContentId = content.ContentId;
        if (contentDetail.AllTags != null && contentDetail.AllTags.length > 0)
            contentDetail.Tags = JSON.stringify(contentDetail.AllTags);
        else
            contentDetail.Tags = content.Tags.length > 0 ? JSON.stringify(content.AllTags) : "[]";

        content.SaveOn = new Date();
        await contentlist.update(contentDetail, {
            where : {
                ContentId: contentDetail.ContentId,
            },
        })
        return content;
    } catch (error) {
        return (error);
    }
}

const PublishArticle = async (req, res) => {
    try {
        const contentId = 0;
        var content = await contentlist.findByPk(contentId);
        if (!content)
            return "record not found";

        content.IsPublish = contentDetail.IsPublish;
        if (content.IsPublish)
            content.PublishOn = new Date();

        return content;
    } catch (error) {
        return (error);
    }
};


const saveFile = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
      // Access the uploaded file
      const uploadedFile = req.files.file;
     
      // Move the file to a specific folder
      const targetPath = path.join(__dirname, 'uploads', uploadedFile.name);
    
      uploadedFile.mv(targetPath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err.message);
        }
    
        res.send('File uploaded and moved successfully.');
      });
};

module.exports = {getAllContent, GetContentList, GetAllContentList, GetContentById, GetArticleList, getContent, saveFile, SaveArticle, PublishArticle};
