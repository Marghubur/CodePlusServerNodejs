const db = require("../db.config");
const contentlist = db.contentlist;
const PAGESIZE = 9;

const getContent = async (req, res) => {
    res.send({msg: "Controller hit successfully"});
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
        res.status(500).send("Internal server error");
    }
};

const GetContentList = async (req, res) => {
    try {
        const page =  1; // Get the page from the query parameters, default to page 1
        const limit = 10; // Number of items per page
        const offset = (page - 1) * limit;
        contentlist.findAndCountAll({
            offset,
            limit
          }).then(data => {
            res.send(data);
        })
    } catch (error) {   
        res.status(500).send("Internal server error");
    }
};

module.exports = {getAllContent, GetContentList};
