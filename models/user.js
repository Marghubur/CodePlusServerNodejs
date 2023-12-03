
module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define('user', {
        UserId: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        UserName: {
            type: Sequelize.STRING
        },
        Email: {
            type: Sequelize.STRING
        },
        Password: {
            type: Sequelize.STRING
        },
        UsertypeId: {
            type: Sequelize.INTEGER
        },
        RoleName: {
            type: Sequelize.VIRTUAL
        },
        RememberMe: {
            type: Sequelize.VIRTUAL
        }
    });

    return user;
}