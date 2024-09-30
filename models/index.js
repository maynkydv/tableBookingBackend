const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('ProjectDB', 'postgres', 'Postgress', {
  host: "localhost",
  dialect: "postgres",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Customer = require('./Customer')(sequelize, DataTypes);
db.Restaurant = require('./Restaurant')(sequelize, DataTypes);
db.Owner = require('./Owner')(sequelize, DataTypes);
db.Booking = require('./Booking')(sequelize, DataTypes);
db.Restaurant_Owner = require('./Restaurant_Owner')(sequelize, DataTypes);


db.Customer.hasMany(db.Booking, { foreignKey: 'customerId' });
db.Booking.belongsTo(db.Customer, { foreignKey: 'customerId' });


db.Restaurant.hasMany(db.Booking, { foreignKey: 'restaurantId' });
db.Booking.belongsTo(db.Restaurant, { foreignKey: 'restaurantId' });

db.Restaurant.belongsToMany(db.Owner, { through: "Restaurant_Owner" });
db.Owner.belongsToMany(db.Restaurant, { through: "Restaurant_Owner" });

db.checkTableAvailability = async (rest_id, date, startTime, endTime) => {
  try {
    // Step 1: Get the total number of tables for the restaurant
    const restaurant = await db.Restaurants.findOne({
      where: { restaurantId: rest_id },
      attributes: ['tableCount']
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const totalTables = restaurant.tableCount;

    // Step 2: Find all booked tables on the given date with overlapping times in a single query
    const bookedTables = await db.Bookings.findAll({
      where: {
        restaurantId: rest_id,
        date: date,
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [startTime, endTime]
            }
          },
          {
            endTime: {
              [Op.between]: [startTime, endTime]
            }
          }
        ]
      },
      attributes: ['tableNumber']
    });
    // Extract booked table numbers
    const bookedTableNumbers = bookedTables.map(booking => booking.tableNumber);


    for (let i = 1; i <= totalTables; i++) {
      if (!bookedTableNumbers.includes(i)) {
        return i;
      }
    }
    return 'No tables available at the specified time.';
  } catch (error) {
    console.error(error);
    throw new Error('Error checking table availability');
  }
};

module.exports = db;

