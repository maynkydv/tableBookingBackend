const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: "localhost",
  dialect: "postgres",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User_.js')(sequelize, DataTypes);
db.Booking = require('./Booking')(sequelize, DataTypes);

db.Restaurant = require('./Restaurant')(sequelize, DataTypes);
db.Restaurant_Owner = require('./Restaurant_Owner')(sequelize, DataTypes);


db.User.hasMany(db.Booking, { foreignKey: 'userId' });
db.Booking.belongsTo(db.User, { foreignKey: 'userId' });


db.Restaurant.hasMany(db.Booking, { foreignKey: 'restaurantId' });
db.Booking.belongsTo(db.Restaurant, { foreignKey: 'restaurantId' });

db.Restaurant.belongsToMany(db.User, { through: "Restaurant_Owner" });
db.User.belongsToMany(db.Restaurant, { through: "Restaurant_Owner" });


module.exports = db;

