module.exports = (sequelize, DataTypes) => {
  const Restaurant_Owner = sequelize.define('Restaurant_Owner', {
    uniqueId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Restaurants',
        key: 'restaurantId',
      },
    },
    restaurantName: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'userId',
      },
    },
    userName: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: false,
  });
  return Restaurant_Owner;
};
