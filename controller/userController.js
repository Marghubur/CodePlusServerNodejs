const db = require("../db.config");
const user = db.user;

const getUser = async (req, res) => {
    res.send({msg: "User Controller hit successfully"});
};

const getAllUser = async (req, res) => {
    try {
        user.findAll().then(data => {
            console.log("Hit user");
            res.send(data);
        })
    } catch (error) {   
        res.status(500).send("Internal server error");
    }
};

module.exports = {getAllUser, getUser};