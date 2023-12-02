const Sequelize = require("sequelize");

const sequelize = new Sequelize("codeplusblog", "codeplusblog", "Marghub12@", {
    host: "db4free.net",
    port: 3306,
    dialect: "mysql",
    define: {
        // Disable automatic pluralization
        freezeTableName: true,
        // Disable timestamps globally for all models
        timestamps: false
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./models/user")(sequelize, Sequelize);
db.contentlist = require("./models/contentList")(sequelize, Sequelize);

module.exports = db;