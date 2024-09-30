const { Restaurant,Restaurant_Owner,Owner } = require('../models');

// * get 'owner/restaurant/:id'  , authenticate, ownerAuth
// exports.getRestaurantDetails = async (req, res) => {
//   try {
//     const restaurantId = req.param.id ;
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
//     res.status(500).json({ msg:'this here' , error: error.message });
//   }
// };

// * post 'owner/restaurant'  , authenticate, ownerAuth
exports.addRestaurant = async (req, res) => {o
  try {
    const ownerId = req.user.ownerId;
    const restaurant = await Restaurant.create(req.body);

    await Restaurant_Owner.create({
      RestaurantRestaurantId: restaurant.restaurantId,
      OwnerOwnerId: ownerId
    });

    res.status(201).json({ success: true, restaurant });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// * post  '/owner/restaurant/addowner'   authenticate, ownerAuth, 
exports.addOwnerToRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.ownerId; 
    const { restaurantId, newOwnerId } = req.body;

    // Verify if the authenticated owner owns the restaurant
    const ownership = await Restaurant_Owner.findOne({
      where: {
        RestaurantRestaurantId: restaurantId,
        OwnerOwnerId: ownerId
      }
    });

    if (!ownership) {
      return res.status(403).json({ message: 'Unauthorized: You do not own this restaurant' });
    }

    const newOwner = await Owner.findByPk(newOwnerId);
    if (!newOwner) {
      return res.status(404).json({ message: 'New owner not found' });
    }

    const existingOwnership = await Restaurant_Owner.findOne({
      where: {
        RestaurantRestaurantId: restaurantId,
        OwnerOwnerId: newOwnerId
      }
    });
    if (existingOwnership) {
      return res.status(400).json({ message: 'This owner is already associated with the restaurant' });
    }
    await Restaurant_Owner.create({
      RestaurantRestaurantId: restaurantId,
      OwnerOwnerId: newOwnerId
    });
    res.status(201).json({ success: true, message: `Owner with ID ${newOwnerId} has been added to the restaurant` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// * delete  'owner/restaurant/remove'  ,authenticate, ownerAuth
exports.removeRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.ownerId;
    const { restaurantId } = req.body;

    const deleted = await Restaurant_Owner.destroy({
      where: {
        RestaurantRestaurantId: restaurantId,
        OwnerOwnerId: ownerId
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

// * delete 'owner/restaurant/delete'  , authenticate, ownerAuth
exports.deleteRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.ownerId;
    const { restaurantId } = req.body;

    const ownership = await Restaurant_Owner.findOne({
      where: {
        RestaurantRestaurantId: restaurantId,
        OwnerOwnerId: ownerId
      }
    });

    if (!ownership) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Restaurant.destroy({
      where: {
        restaurantId: restaurantId
      }
    });

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};