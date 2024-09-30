const { Restaurant, Restaurant_Owner, User } = require('../models');

// * post 'admin/restaurant'  , authenticate, adminAuth
exports.addRestaurant = async (req, res) => {
  try {
    const ownerId = req.body.ownerId;

    const owner = await User.findByPk(ownerId);
    if (!owner) {
      res.status(403).json({ message: `User with userId ${ownerId} doesn't exist` });
    }

    const restaurant = await Restaurant.create(req.body);

    await Restaurant_Owner.create({
      RestaurantRestaurantId: restaurant.restaurantId,
      UserUserId: ownerId
    });

    if (owner.role == 'customer') {
      const updatedUser = owner;
      updatedUser.role = 'owner';
      owner.set(updatedUser);
      await owner.save();
    }


    res.status(201).json({ success: true, restaurant });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// * put 'admin/restaurant'  , authenticate, adminAuth
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.body.restaurantId;
    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: `Unable to Find Restaurant with restaurantId ${restaurantId}` });
    }
    else {
      const updatedDetails = req.body;
      restaurant.set(updatedDetails);
      await restaurant.save;
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// * post  'admin/restaurant/addowner'   authenticate, adminAuth, 
exports.addOwnerToRestaurant = async (req, res) => {
  try {
    const { restaurantId, newOwnerId } = req.body;

    const restaurant = await Restaurant.findOne({
      where: {
        restaurantId: restaurantId
      }
    });

    if (!restaurant) {
      return res.status(404).json({ message: `Unable to Find Restaurant with restaurantId ${restaurantId}` });
    }

    const newOwner = await User.findByPk(newOwnerId);
    if (!newOwner) {
      return res.status(404).json({ message: 'New owner not found' });
    }

    const existingOwnership = await Restaurant_Owner.findOne({
      where: {
        RestaurantRestaurantId: restaurantId,
        UserUserId: newOwnerId
      }
    });
    if (existingOwnership) {
      return res.status(400).json({ message: 'This owner is already associated with the restaurant' });
    }
    await Restaurant_Owner.create({
      RestaurantRestaurantId: restaurantId,
      UserUserId: newOwnerId
    });
    if (newOwner.role == 'customer') {
      const updatedUser = newOwner;
      updatedUser.role = 'owner';
      newOwner.set(updatedUser);
      await newOwner.save();
    }
    res.status(201).json({
      success: true,
      message: `Owner with ID ${newOwnerId} has been added to the Owner list of restaurant with restaurantId ${restaurantId}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// * delete  'admin/restaurant/remove'  ,authenticate, adminAuth
exports.removeRestaurant = async (req, res) => {
  try {
    const { restaurantId, ownerId } = req.body;

    const deleted = await Restaurant_Owner.destroy({
      where: {
        RestaurantRestaurantId: restaurantId,
        UserUserId: ownerId
      }
    });

    if (deleted) {
      res.status(200).json({ message: 'Ownership removed successfully' });
    } else {
      res.status(404).json({ message: 'Ownership not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// * delete 'owner/restaurant/delete'  , authenticate, adminAuth
exports.deleteRestaurant = async (req, res) => {
  try {

    const { restaurantId } = req.body;

    const deleted = await Restaurant.destroy({
      where: {
        restaurantId: restaurantId
      }
    });
    if (!deleted) {
      res.status(404).json({ message: `Restaurant Deletion Unsuccessful` })
    }
    else {
      res.status(200).json({ message: 'Restaurant deleted successfully' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// TODO : need to work on relationship
// // * get 'admin/restaurant/:id'  , authenticate, ownerAuth
// exports.getRestaurantDetails = async (req, res) => {
//   try {
//     const restaurantId = req.param.id;
//     const owners = await Owner.findAll({
//       include: [
//         {
//           model: Restaurant_Owner,
//           where: { RestaurantRestaurantId: restaurantId },
//           attributes: []
//         }
//       ]
//     });
//     if (owners.length === 0) {
//       return res.status(404).json({ message: 'No owners found for this restaurant' });
//     }
//     res.status(200).json(owners);
//   } catch (error) {
//     res.status(500).json({ msg: 'this here', error: error.message });
//   }
// };
