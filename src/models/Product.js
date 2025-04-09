const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');


//nuevamente, es posible agregar las validaciones aquí también.
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
    // validate: {
    //   len: { 
    //     args: [4, 25],
    //     msg: 'Name must be between 4 and 25 characters'
    //   }
    // }
  },
  categories: {
    type: DataTypes.JSON,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  notice: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Product;
