const sequelize = require('../database')
const {DataTypes} = require('sequelize')

module.exports = sequelize.define('commands',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    commandName: {type: DataTypes.STRING, allowNull: false},
    commandToSend: {type: DataTypes.STRING, allowNull: false},
    shouldReturn:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false},
    image:{type:DataTypes.BLOB('long'),allowNull:true}
})