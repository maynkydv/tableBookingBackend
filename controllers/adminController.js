const { User } = require('../models')
require('dotenv').config();


// * put  'admin/define' , authenticate 
exports.defineAdmin = async (req, res) => {
  const userId = req.user.userId;
  const { ADMIN_KEY } = req.body;
  try {
    if (ADMIN_KEY === process.env.ADMIN_KEY) {
      const user = await User.findByPk(userId);

      if (user) {
        const updatedUser = user;
        updatedUser.role = 'admin';
        user.set(updatedUser);
        await user.save();
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
    else {
      return res.status(401).json({ message: 'Invalid ADMIN_KEY' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};