
module.exports = (sequelize, Sequelize) => {
    const contentlist = sequelize.define('contentlist', {
        ContentId: {
            type: Sequelize.INTEGER,
            primaryKey: true
          },
          Type: {
            type: Sequelize.STRING,
          },
          Part: {
            type: Sequelize.INTEGER,
          },
          FilePath: {
            type: Sequelize.STRING,
          },
          FileId: {
            type: Sequelize.INTEGER,
          },
          Title: {
            type: Sequelize.STRING,
          },
          Detail: {
            type: Sequelize.STRING,
          },
          ImgPath: {
            type: Sequelize.STRING,
          },
          ImgId: {
            type: Sequelize.VIRTUAL, // Not stored in the database
          },
          BodyContent: {
            type: Sequelize.VIRTUAL, // Not stored in the database
          },
          IsArticle: {
            type: Sequelize.BOOLEAN,
          },
          IsPublish: {
            type: Sequelize.BOOLEAN,
          },
          PublishOn: {
            type: Sequelize.DATE,
          },
          SaveOn: {
            type: Sequelize.DATE,
          },
          Tags: {
            type: Sequelize.STRING,
          },
          AllTags: {
            type: Sequelize.VIRTUAL, // Not stored in the database
          },
          Author: {
            type: Sequelize.STRING,
          },
    });

    return contentlist;
}