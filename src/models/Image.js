const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');


//se podrían agregar las validaciones aquí tambien en vez de en un controlador
const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Image;
