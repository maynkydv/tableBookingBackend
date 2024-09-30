const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const adminAuth = require('../middlewares/adminAuth');
const bookingController = require('../controllers/bookingController');
const restaurantController = require('../controllers/restaurantController');
const adminController = require('../controllers/adminController');



// Become Admin 
router.put('/define',authenticate , adminController.defineAdmin);


// Restaurant Related
router.post('/restaurant',authenticate, adminAuth, restaurantController.addRestaurant);
router.put('/restaurant',authenticate, adminAuth, restaurantController.updateRestaurant);

router.post('/restaurant/addowner' ,authenticate, adminAuth, restaurantController.addOwnerToRestaurant ) ;
router.delete('/restaurant/remove',authenticate, adminAuth, restaurantController.removeRestaurant); // remove ownership of user form this restaurant 
router.delete('/restaurant/delete',authenticate, adminAuth, restaurantController.deleteRestaurant);


// Booking Related
// router.get('/restaurant/bookings' , authenticate, adminAuth, bookingController.getBookingOfRestaurant );

// TODO: fixes needed
// router.get('/restaurant/:id', authenticate, adminAuth, restaurantController.getRestaurantDetails);

module.exports = router;