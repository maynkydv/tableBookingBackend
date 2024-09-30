const { Customer , Booking } = require('../models');
const { generateToken } = require('../utils/token');

// * post 'customer/register'  
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body); 
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// * post  'customer/login' 
exports.loginCustomer = async (req,res) =>{
  const {email,password} = req.body;
  try {
    const customer = await Customer.findOne({where : {email}});
    if (!customer) {
      return res.status(404).json({ message: 'invalid email' });
    }

    const isMatch = await customer.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = await generateToken({ customerId: customer.customerId, role:'customer', email : customer.email });

    res.cookie('tokenId',token);
    res.status(200).json({success:true,message:"Successfully logged in",jwtToken:token});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// * get  'customer/', authenticate , customerAuth
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.user.customerId, {
      include: [
        {
          model: Booking,
          as: "Bookings",
        },
      ],
    });

    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(401).json({ message: "Please Login First" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// * put  'customer/' , authenticate , customerAuth
exports.updateCustomer = async (req, res) => {
  const customerId = req.user.customerId; 
  try {
    const customer = await Customer.findByPk(customerId);
    if (customer) {
      customer.set(req.body); 
      await customer.save();
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// * delete 'customer/'  , authenticate, customerAuth
exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.destroy({
      where: { customerId: req.user.customerId  },
    });
    if (deleted) {
      res.clearCookie('tokenId').status(200).json({ message: "user deleted successfully" });
    } else {
      res.status(401).json({ message: "Please Login First"  });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


