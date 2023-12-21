const db = require("../db.config");
const contentlist = db.contentlist;
const fileUpload = require('express-fileupload');
const path = require('path');
const util = require("../util/util.js");
const { ApiResponse } = require("../util/apiResponse.js");
const fs = require('fs');

const minNumber = 20;
const maaxNumber = 9999999999;

const getContent = async (req, res, next) => {
    return next(ApiResponse({msg: __dirname + ": " + process.cwd()}, 200));
};

const getAllContent = async (req, res, next) => {
    try {
        contentlist.findAll().then(data => {
            return next(ApiResponse(data, 200))
        })
    } catch (error) {   
        return next(ApiResponse(error.message, 500));
    }
};

const GetContentList = async (req, res, next) => {
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
            result.forEach( x => {
                x.AllTags = x.Tags;
            });
            return next(ApiResponse(result, 200));
        })
    } catch (error) {   
        return next(ApiResponse(error.message, 500));
    }
};

const GetAllContentList = async (req, res, next) => {
    try {
        const page =  req.params.page; // Get the page from the query parameters, default to page 1
        const limit = 10; // Number of items per page
        const offset = (page - 1) * limit;
        contentlist.findAll().then(data => {
            var result = data.splice(offset, limit);
            result.forEach( x => {
                x.AllTags = x.Tags;
            });
            return next(ApiResponse(result, 200));
        })
    } catch (error) {   
        return next(ApiResponse(error.message, 500));
    }
};

const GetContentById = async (req, res, next) => {
    try {
        const id =  Number(req.params.contentId);
        if (id <= 0)
            return next(ApiResponse("Invalid content id", 500));

        await contentlist.findByPk(id).then(data => {
            if (!data)
                return next(ApiResponse("Record not found", 500));

            var filepath = path.join(process.cwd(), "public", data.FilePath);
            if (filepath.includes("\\"))
                filepath = filepath.replace("\\", "/");
            
            const readData = fs.readFileSync(filepath, "utf8");
            data.BodyContent = readData;
            data.AllTags = data.Tags;
            return next(ApiResponse(data, 200));
        })
    } catch (error) {   
        return next(ApiResponse(error.message, 500));
    }
};

const GetArticleList = async (req, res, next) => {
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
            return next(ApiResponse(result, 200));
        })
    } catch (error) {   
        return next(ApiResponse(error.message, 500));
    }
};

const SaveArticle = async (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return next(ApiResponse('No files were uploaded.', 400));
        }
    
        var uploadedFile = req.files.file;
        var text = req.body.article;
        var user = JSON.parse(text);
        var imgpath = util.saveFile("article", uploadedFile, user.Type+ getUniqueRandomInt(minNumber, maaxNumber).toString() + "_"+ user.Part, user.ImgPath);
        if (!imgpath) 
            return next(ApiResponse("Fail to save image", 500));
        
        user.ImgPath = imgpath;
        var filepath = util.saveTxtFile("article", user.BodyContent, user.Type+ getUniqueRandomInt(minNumber, maaxNumber).toString() + "_"+ user.Part);
        if (!filepath)
            return next(ApiResponse("Fail to generate text file", 500));
        
        user.FilePath = filepath;
        var result = null;
        if (user.ContentId == 0)
            result =  createArticle(user);
        else
            result = updateArticle(user);

        const responseData = {
            StatusMessage: 'success',
            ResponseBody: result,
            StatusCode: 200
        };
        return next(ApiResponse(result, 200));
    } catch (error) {   
        return next(ApiResponse(error.message, 500));
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

function getUniqueRandomInt(min, max) {
    const generatedNumbers = new Set();
  
    function generate() {
      const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!generatedNumbers.has(randomInt)) {
        generatedNumbers.add(randomInt);
        return randomInt;
      } else {
        return generate(); // Recursively try again if number is already generated
      }
    }
  
    return generate();
}

const PublishArticle = async (req, res, next) => {
    try {
        const contentId = req.body.ContentId;
        const IsPublish = req.body.IsPublish;
        var content = await contentlist.findByPk(contentId);
        if (!content)
            return "record not found";

        if (IsPublish)
            content.PublishOn = new Date();

        const contentDetail = {
            ContentId: contentId,
            Type: content.Type,
            Part: content.Part,
            FilePath: content.FilePath,
            FileId: content.FileId,
            Title: content.Title,
            Detail: content.Detail,
            ImgPath: content.ImgPath,
            IsArticle: content.IsArticle,
            IsPublish: IsPublish,
            PublishOn: content.PublishOn,
            SaveOn: content.SaveOn,
            Tags: content.Tags.length > 0 ? JSON.stringify(content.AllTags) : "[]",
            Author: content.Author,
        }
        await contentlist.update(contentDetail, {
            where : {
                ContentId: contentDetail.ContentId,
            },
        });

        return next(ApiResponse(contentDetail, 200));
    } catch (error) {
        return next(ApiResponse(error.message, 500));
    }
};


const saveFile = async (req, res, next) => {
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
          return next(ApiResponse(error.message, 500));
        }
    
        res.send('File uploaded and moved successfully.');
      });
};

module.exports = {getAllContent, GetContentList, GetAllContentList, GetContentById, GetArticleList, getContent, saveFile, SaveArticle, PublishArticle};
