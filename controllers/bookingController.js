const { Booking, Restaurant_Owner , Restaurant} = require('../models');
const { Op } = require('sequelize');




// *  get  'user/booking' , authenticate, customerAuth 
exports.getBookingOfUser = async (req, res) => {
  try {
    const userId = req.user.userId; 

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Restaurant,
          as: 'Restaurant',
          attributes: ['name', 'location'] 
        }
      ]
    });

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this customer." });
    }

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// *  post  'user/booking' , authenticate, customerAuth 
exports.bookTable = async (req, res) => {
  try {
    const { restaurantId, date, startTime, endTime, guestCount } = req.body;
    const userId = req.user.userId;

    const availableTable = await checkTableAvailability(restaurantId, date, startTime, endTime);

    if (typeof availableTable === 'string') {
      return res.status(409).json({ message: availableTable }); // No tables available
    }

    const booking = await Booking.create({
      userId,
      restaurantId,
      tableNumber: availableTable,
      date,
      startTime,
      endTime,
      guestCount
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// *  delete  'user/booking' , authenticate, customerAuth 
exports.deleteBooking = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ where: { bookingId, customerId } });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or doesn't belong to the customer." });
    }

    await Booking.destroy({ where: { bookingId } });

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function checkTableAvailability (rest_id, date, startTime, endTime) {
  try {
    const restaurant = await Restaurant.findOne({
      where: { restaurantId: rest_id },
      attributes: ['tableCount']
    });

    if (!restaurant) {
      return ('Restaurant not found');
    }

    const totalTables = restaurant.tableCount;

    const bookedTables = await Booking.findAll({
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




// * get 'owner/restaurant/bookings',    authenticate, ownerAuth,
// exports.getBookingOfRestaurant = async (req, res) => {
//   try {
//     const { restaurantId } = req.body;
//     const ownerId = req.user.ownerId;

//     const ownership = await Restaurant_Owner.findOne({
//       where: {
//         RestaurantId: restaurantId,
//         OwnerId: ownerId
//       }
//     });

//     if (!ownership) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     const bookings = await Booking.findAll({
//       where: {
//         restaurantId: restaurantId
//       }
//     });

//     res.status(200).json({success: true, bookings});
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };