module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    restaurantId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // email: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   // unique: true,
    // },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    tableCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {timestamps: false}
);
  return Restaurant ;
}
