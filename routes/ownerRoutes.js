const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const ownerAuth = require('../middlewares/ownerAuth');
const ownerController = require('../controllers/ownerController');
const bookingController = require('../controllers/bookingController');
const restaurantController = require('../controllers/restaurantController');


router.post('/register', ownerController.createOwner);
router.post('/login', ownerController.loginOwner);

router.get('/', authenticate , ownerAuth ,ownerController.getOwnerDetails);
router.put('/' , authenticate , ownerAuth , ownerController.updateOwner);
router.delete('/',authenticate, ownerAuth, ownerController.deleteOwner);

// Restaurant Related
// router.get('/restaurant/:id', authenticate, ownerAuth, restaurantController.getRestaurantDetails);
router.post('/restaurant',authenticate, ownerAuth, restaurantController.addRestaurant);
router.post('/restaurant/addowner' ,authenticate, ownerAuth, restaurantController.addOwnerToRestaurant ) ;
router.delete('/restaurant/remove',authenticate, ownerAuth, restaurantController.removeRestaurant); // remove ownership of current owner form this restaurant 
router.delete('/restaurant/delete',authenticate, ownerAuth, restaurantController.deleteRestaurant);

// Booking Related
// router.get('/restaurant/bookings' , authenticate, ownerAuth, bookingController.getBookingOfRestaurant );

module.exports = router;