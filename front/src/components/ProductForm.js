import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

const ProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    categories: [],
    price: '',
    notice: 'Normal',
    images: []
  });

  const [tempImage, setTempImage] = useState({ title: '', file: null });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validCategories = ['Entretención', 'Videojuegos', 'Smart home'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      categories: e.target.value
    }));
  };

  const handleImageTitleChange = (e) => {
    setTempImage(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setTempImage(prev => ({
        ...prev,
        file: e.target.files[0]
      }));
    }
  };

  const uploadImage = async () => {
    if (!tempImage.file || !tempImage.title) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', tempImage.file);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = response.data.url;
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { 
          title: tempImage.title, 
          imageUrl: `${API_URL}${imageUrl}`
        }]
      }));

      setTempImage({ title: '', file: null });
      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error al subir la imagen: ' + error.message);
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const dataToSend = {
        ...formData,
        price: Number(formData.price)
      };

      const response = await axios.post(`${API_URL}/products`, dataToSend);
      setSuccess(true);
      setFormData({
        name: '',
        categories: [],
        price: '',
        notice: 'Normal',
        images: []
      });
      if (onProductAdded) {
        onProductAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.errors || ['Error al crear el producto']);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Registro de Producto
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {Array.isArray(error) ? error.join(', ') : error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Producto creado exitosamente
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          label="Nombre del producto"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />

        <FormControl fullWidth required>
          <InputLabel>Categorías</InputLabel>
          <Select
            multiple
            name="categories"
            value={formData.categories}
            onChange={handleCategoryChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {validCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Precio"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          required
        />

        <FormControl fullWidth required>
          <InputLabel>Aviso</InputLabel>
          <Select
            name="notice"
            value={formData.notice}
            onChange={handleChange}
          >
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Destacado">Destacado</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Agregar Imagen
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Título de la imagen"
              name="title"
              value={tempImage.title}
              onChange={handleImageTitleChange}
              fullWidth
            />
            <input
              accept="image/jpeg,image/png"
              type="file"
              onChange={handleFileChange}
              style={{ marginBottom: '1rem' }}
            />
            <Button
              variant="outlined"
              onClick={uploadImage}
              disabled={!tempImage.file || !tempImage.title || uploading}
            >
              {uploading ? <CircularProgress size={24} /> : 'Subir Imagen'}
            </Button>
          </Stack>
        </Box>

        {formData.images.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Imágenes agregadas
            </Typography>
            <Stack spacing={1}>
              {formData.images.map((img, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    border: '1px solid #eee',
                    borderRadius: 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img 
                      src={img.imageUrl} 
                      alt={img.title} 
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                    <Typography>
                      {img.title}
                    </Typography>
                  </Box>
                  <Button
                    color="error"
                    size="small"
                    onClick={() => removeImage(index)}
                  >
                    Eliminar
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={formData.images.length === 0}
        >
          Agregar Producto
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductForm;
