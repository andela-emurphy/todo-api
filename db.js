const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development'

if(env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect : 'postres'      
      });
}else {
  sequelize = new Sequelize(undefined,undefined, undefined, {
        dialect : 'sqlite',
        storage: __dirname+'/data/andela-todoapi.sqlite'
      });
}


let db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;