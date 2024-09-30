const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Owner = sequelize.define('Owner', {
    ownerId: {
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
    { timestamps: false }
  );

  async function hashPassword(owner) {
    if (owner.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      owner.password = await bcrypt.hash(owner.password, salt);
    }
  }

  Owner.beforeSave(hashPassword);
  // Owner.beforeCreate(hashPassword);
  // Owner.beforeUpdate(hashPassword);

  Owner.prototype.validPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return Owner;
}


