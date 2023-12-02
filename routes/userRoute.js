const express = require("express");

const route = express.Router();
const {getAllUser, getUser} = require("../controller/userController.js")

route.get("/getAllUser", getAllUser);
route.get("/getUser", getUser);


module.exports = route;