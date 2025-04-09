const Product = require('./Product');
const Image = require('./Image');

// Establecer relaciones
Product.hasMany(Image, {
  foreignKey: 'productId',
  as: 'images',
  onDelete: 'CASCADE'
});

Image.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

module.exports = {
  Product,
  Image
};
