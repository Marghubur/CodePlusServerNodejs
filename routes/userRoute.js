const express = require("express");

const route = express.Router();
const {getAllUser, getUser, UserRegistration} = require("../controller/userController.js")

route.get("/getAllUser", getAllUser);
route.get("/getUser", getUser);
route.post("/UserRegistration", UserRegistration);



module.exports = route;