const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts } = require('../controllers/productController');

//creación de los productos
router.post('/', createProduct);

//obtención de todos los productos
router.get('/', getAllProducts);

module.exports = router;
