module.exports = (sequelize, Sequelize) => {
    const notesDetails = sequelize.define('notesDetails', {
        NoteId: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        Title: {
            type: Sequelize.STRING
        },
        Content: {
            type: Sequelize.VIRTUAL
        },
        FilePath: {
            type: Sequelize.STRING
        },
        UserId: {
            type: Sequelize.INTEGER
        }
    });

    return notesDetails;
}