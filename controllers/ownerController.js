const { Owner , Restaurant } = require('../models');
const { generateToken } = require('../utils/token');

// * post 'owner/register' 
exports.createOwner = async (req, res) => {
  try {
    const owner = await Owner.create(req.body);
    res.status(201).json(owner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// * post 'owner/login' 
exports.loginOwner = async (req, res) => {
  const { email, password } = req.body;
  try {
    const owner = await Owner.findOne({ where: { email } });
    if (!owner) {
      return res.status(404).json({ message: 'invalid email' });
    }

    const isMatch = await owner.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = await generateToken({ ownerId: owner.ownerId, role: 'owner', email: owner.email });

    res.cookie('tokenId', token);
    res.status(200).json({ success: true, message: "Successfully logged in" , jwtToken:token});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// * get 'owner/' , authenticate , ownerAuth  
exports.getOwnerDetails = async (req ,res) => {
  try {
    const ownerId = req.user.ownerId; 
    const ownerDetails = await Owner.findOne({
      where: { ownerId },
      include: [
        {
          model: Restaurant,
          as: 'Restaurants',
          through: { attributes: [] }, 
        }
      ]
    });
    if (!ownerDetails) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    res.status(200).json({
      success: true,
      owner: ownerDetails
    });
  } catch (error) {
    res.status(500).json({error : error.message});
  }  
}

// * put 'owner/'  ,  authenticate , ownerAuth
exports.updateOwner = async (req, res) => {
  const ownerId = req.user.ownerId; 
  try {
    const owner = await Owner.findByPk(ownerId);
    if (owner) {
      owner.set(req.body); 
      await owner.save();
      res.status(200).json(owner);
    } else {
      res.status(404).json({ message: "Owner not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// * delete  'owner/'  ,   authenticate, ownerAuth
exports.deleteOwner = async (req, res) => {
  try {
    const deleted = await Owner.destroy({
      where: { ownerId: req.user.ownerId },
    });
    if (deleted) {
      res.clearCookie('tokenId').status(200).json({ message: "user deleted successfully" });
    } else {
      res.status(401).json({ message: "Please Login First" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
