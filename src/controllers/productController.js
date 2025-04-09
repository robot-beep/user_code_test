const { Product, Image } = require('../models');


const validateProduct = (product) => {
  const errors = [];

  if (!product.name || typeof product.name !== 'string') {
    errors.push('El nombre es obligatorio y debe ser un texto');
  } else if (!product.name.match(/^[a-zA-Z0-9\s]{4,25}$/)) {
    errors.push('El nombre debe tener entre 4 y 25 caracteres y contener solo letras, números y espacios');
  }

  const validCategories = ['Entretención', 'Videojuegos', 'Smart home'];
  if (!Array.isArray(product.categories)) {
    errors.push('Las categorias deben ser un array');
  } else if (!product.categories.every(cat => validCategories.includes(cat))) {
    errors.push(`Las categorias deben ser una de: ${validCategories.join(', ')}`);
  }

  if (typeof product.price !== 'number') {
    errors.push('El precio debe ser un número');
  } else if (product.price < 0 || product.price > 2000000) {
    errors.push('El precio debe estar entre 0 y 2,000,000');
  }

  const validNotices = ['Destacado', 'Normal'];
  if (!validNotices.includes(product.notice)) {
    errors.push(`El aviso debe ser uno de: ${validNotices.join(', ')}`);
  }

  return errors;
};

const validateImages = (images) => {
  const errors = [];

  if (!Array.isArray(images) || images.length === 0) {
    errors.push('Debe tener al menos una imagen');
    return errors;
  }

  images.forEach((image, index) => {
    if (!image.title || (typeof image.title !== 'string' && typeof image.title !== 'number')) {
      errors.push(`La imagen ${index + 1}: el título es obligatorio y debe ser un texto`);
    } else if (typeof image.title === 'string' && !image.title.match(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]{5,30}$/)) {
      errors.push(`La imagen ${index + 1}: el título debe tener entre 5 y 30 caracteres y contener solo letras, números y espacios`);
    }

    if (!image.imageUrl || typeof image.imageUrl !== 'string') {
      errors.push(`La imagen ${index + 1}: la URL de la imagen es obligatoria y debe ser un texto`);
    } else if (!image.imageUrl.match(/\.(jpg|png|jpeg)$/i)) {
      errors.push(`La imagen ${index + 1}: la imagen debe ser JPG o PNG`);
    }
  });

  return errors;
};

const createProduct = async (req, res) => {
  try {
    const { name, categories, price, notice, images } = req.body;

    //validamos con las funciones de validación 
    const productErrors = validateProduct({ name, categories, price, notice });
    const imageErrors = validateImages(images);
    const errors = [...productErrors, ...imageErrors];

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const product = await Product.create({
      name,
      categories,
      price,
      notice
    });

    const imagePromises = images.map(image => 
      Image.create({
        title: image.title,
        imageUrl: image.imageUrl,
        productId: product.id
      })
    );

    //esperamos a que se creen las imágenes
    await Promise.all(imagePromises);

    const productWithImages = await Product.findByPk(product.id, {
      include: [{
        model: Image,
        as: 'images'
      }]
    });

    res.status(201).json(productWithImages);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Image,
        as: 'images'
      }]
    });

    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
  getAllProducts
};
