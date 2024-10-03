const express = require('express');

const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');
const restaurantController = require('../controllers/restaurantController');

router.post('/register', userController.createUser);
router.post('/login', userController.login);

router.get('/', authenticate, userController.getUserDetails);
router.put('/', authenticate, userController.updateUser);
router.delete('/', authenticate, userController.deleteUser);

// Booking
router.get('/booking', authenticate, bookingController.getBookingOfUser);
router.post('/booking', authenticate, bookingController.bookTable);
router.delete('/booking', authenticate, bookingController.deleteBooking);

// Restaurant
router.get('/restaurant', restaurantController.getAllRestaurant);

module.exports = router;
