const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:");

const Issue = sequelize.define(
    "Issue",
    {
        _id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        project: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        issue_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        issue_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        assigned_to: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        open: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        status_text: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
    },
    {
        createdAt: "created_on",
        updatedAt: "updated_on",
    }
);

sequelize.sync();

module.exports = { sequelize, Issue };
