const  jwt  = require("jsonwebtoken");
const { ApiResponse } = require("./apiResponse");

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token)
        return next(ApiResponse("You are not authorized", 401));

    var jwtSecret = "MyJwt@$Secret4codeplus@blogBYm4M@rghub"
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err)
            return next(ApiResponse("Token is not valid", 403));
        else
            req.user = user;
        next();
    })
}

const verifyUser = (req, res, next) => {
    verfiyToken(req, res, () => {
        if (req.user.user.UsertypeId !== 1)
            next();
        else
            return next(ApiResponse("Token is not valid", 403));
    })
}

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.user.UsertypeId === 1)
            next();
        else
            return next(ApiResponse("Token is not valid", 403));
    })
}

module.exports = {verifyUser, verifyAdmin}