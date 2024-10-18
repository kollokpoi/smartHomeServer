const command = require('./command')
const item = require('./item')
const verb = require('./verb')

item.hasMany(command, { onDelete: 'CASCADE' })
command.belongsTo(item, { onDelete: 'CASCADE' })

command.hasMany(verb, { onDelete: 'CASCADE' });
verb.belongsTo(command, { onDelete: 'CASCADE', allowNull: false });

module.exports={
  item,
  verb,
  command,
}