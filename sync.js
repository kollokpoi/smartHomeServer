const sequelize = require('./database');
const { Item, Command, Verb, VerbMove, VerbType, ItemName } = require('./models/models');

sequelize.sync({ force: true }) // Use { force: true } to drop and recreate the tables each time
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Unable to create table:', err);
  });