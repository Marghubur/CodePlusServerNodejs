require("dotenv").config();
const express = require("express");
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 7500;
const contentRoute = require("./routes/contentListRoute");
const userRoute = require("./routes/userRoute");

app.get("/", (req, res) => {
    res.send("Hi, I am live");
});

// middleware or routes
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use("/api/Article", contentRoute);
app.use("/api/User", userRoute);

// request handling middleware
app.use((obj, req, res, next) => {
    const statuscode = obj.StatusCode || 500;
    return res.status(statuscode).json({
        ResponseBody: obj.ResponseBody,
        StatusCode: statuscode,
        StatusMessage: "Successfull"
    })
})


const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`PORT Listening: ${PORT}`)
        });
    } catch (error) {
        console.log(error);
    }
};

start();