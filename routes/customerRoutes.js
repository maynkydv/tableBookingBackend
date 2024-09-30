const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const customerAuth = require('../middlewares/customerAuth');
const customerController  = require('../controllers/cutomerController');
const bookingController  = require('../controllers/bookingController');


router.post('/register', customerController.createCustomer);
router.post('/login', customerController.loginCustomer);

router.get('/', authenticate , customerAuth ,customerController.getCustomer);
router.put('/' , authenticate , customerAuth , customerController.updateCustomer);
router.delete('/',authenticate, customerAuth , customerController.deleteCustomer);

// Booking
router.get('/booking' , authenticate, customerAuth, bookingController.getBookingOfCustomer );
router.post('/booking' , authenticate, customerAuth, bookingController.bookTable );
router.delete('/booking' , authenticate, customerAuth, bookingController.deleteBooking );

module.exports = router;
