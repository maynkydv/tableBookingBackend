const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    customerId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: { //*credential
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {  //*credential
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {timestamps: false}
);

  async function hashPassword(customer) {
    if (customer.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      customer.password = await bcrypt.hash(customer.password, salt);
    }
  } 

  Customer.beforeSave(hashPassword);
  // Customer.beforeCreate(hashPassword);
  // Customer.beforeUpdate(hashPassword);


  Customer.prototype.validPassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  return Customer ;
}
