const express = require("express");

const route = express.Router();
const {getAllUser, getUser, UserRegistration, Login} = require("../controller/userController.js");
const { verifyAdmin } = require("../util/verifyToken.js");

route.get("/getAllUser", verifyAdmin, getAllUser);
route.get("/getUser", getUser);
route.post("/UserRegistration", UserRegistration);
route.post("/Login", Login);


module.exports = route;