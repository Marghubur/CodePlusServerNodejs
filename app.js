require("dotenv").config();
const express = require("express");
const app = express();
var cors = require('cors');

const PORT = process.env.PORT || 7500;
const contentRoute = require("./routes/contentListRoute");
const userRoute = require("./routes/userRoute");

app.get("/", (req, res) => {
    res.send("Hi, I am live");
});

// middleware or routes
app.use(cors());
app.use("/api/Article", contentRoute);
app.use("/api/user", userRoute);


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