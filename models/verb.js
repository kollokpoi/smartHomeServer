const sequelize = require('../database')
const {DataTypes} = require('sequelize')

module.exports = sequelize.define('verbs',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    verb: {type: DataTypes.STRING, allowNull: false},
})

