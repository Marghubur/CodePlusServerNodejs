const db = require("../db.config");
const user = db.user;
const bcrypt = require("bcryptjs");
const { ApiResponse } = require("../util/apiResponse.js");
const jwt = require("jsonwebtoken");
const { APi_KEY, Admin, User, AdminRoleId, UserRoleId } = require("../models/applicationConstant.js");

const getUser = async (req, res, next) => {
    res.send({msg: "User Controller hit successfully"});
};

const getAllUser = async (req, res, next) => {
    try {
        user.findAll().then(data => {
            console.log("Hit user");
            return next(ApiResponse(data, 200));
        })
    } catch (error) {   
        return next(ApiResponse("Internal server error", 500));
    }
};

const UserRegistration = async (req, res, next) => {
    try {
        const UserName = req.body.UserName;
        var Email = req.body.Email;
        var Password = req.body.Password;
        var userId = 0;

        if (!UserName)
            return next(ApiResponse("Invalid user name", 500));

        if (!Email)
            return next(ApiResponse("Invalid email", 500));

        if (!Password)
            return next(ApiResponse("Invalid password", 500));

        var existUser = await user.findOne({ where: { Email: Email } });
        if (existUser)
            return next(ApiResponse("Email already exist", 500));

        var lastUser = await user.findOne({
            order: [["UserId", "DESC"]]
        });

        if (lastUser)
            userId = lastUser.UserId + 1;
        else
            userId = 1;

        var salt = await bcrypt.genSalt(10);
        var hashPassword = await bcrypt.hash(Password, salt);
        const userDetail = {
            UserId: userId,
            UserName: UserName,
            Email: Email,
            Password: hashPassword,
            UsertypeId: UserRoleId,
        }
        await user.create(userDetail);

        return next(ApiResponse("Registration successfully", 200));
    } catch (error) {
        return next(ApiResponse(error.message, 500));
    }
};

const Login = async (req, res, next) => {
    try {
        var Email = req.body.Email;
        var Password = req.body.Password;
        if (!Email)
            return next(ApiResponse("Invalid email", 500));

        if (!Password)
            return next(ApiResponse("Invalid password", 500));

        var existUser = await user.findOne({ where: { Email: Email } });
        if (!existUser)
            return next(ApiResponse("Please enter registered email", 500));

        isPasswordCorrect = await bcrypt.compare(Password, existUser.Password);
        if (!isPasswordCorrect)
            return next(ApiResponse("Please enter registered password", 500));

        var role = null;
        switch (existUser.UsertypeId) {
            case AdminRoleId:
                role = Admin.toLocaleLowerCase()
                break;
            default:
                role = User.toLocaleLowerCase()
                break;
        }
        const token = jwt.sign({id: existUser.UserId, user: existUser, email: existUser.Email, role:role}, APi_KEY, { expiresIn: '1h' });
        return res.cookie("access_token", token, {httpOnly: true}).status(200).json(ApiResponse({
            user: existUser,
            Token: token
        }, 200));
    } catch (error) {
        return next(ApiResponse(error.message, 500));
    }
};

module.exports = {getAllUser, getUser, UserRegistration, Login};