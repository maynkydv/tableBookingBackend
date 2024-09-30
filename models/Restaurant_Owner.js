module.exports = (sequelize, DataTypes) => {
    const Restaurant_Owner = sequelize.define('Restaurant_Owner', {
        uniqueId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    },
    {timestamps: false}
  );
    return Restaurant_Owner ;
}
