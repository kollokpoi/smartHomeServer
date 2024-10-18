const sequelize = require('../database')
const {DataTypes} = require('sequelize')

module.exports = sequelize.define('items',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.BLOB('long'), allowNull: true},
    ipaddr: {type: DataTypes.STRING, allowNull: false},
})