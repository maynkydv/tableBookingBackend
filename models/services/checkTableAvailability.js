const { Op } = require('sequelize');
const {Restaurants , Bookings} = require('../index');

exports.checkTableAvailability = async (rest_id, date, startTime, endTime) => {
  try {
    const restaurant = await Restaurants.findOne({
      where: { restaurantId: rest_id },
      attributes: ['tableCount']
    });

    if (!restaurant) {
      return ('Restaurant not found');
    }

    const totalTables = restaurant.tableCount;

    const bookedTables = await Bookings.findAll({
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
    console.log(error);
    return ('Error checking table availability' , error );
  }
};