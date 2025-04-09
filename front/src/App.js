import React, { useState, useEffect } from 'react';
import { Container, CssBaseline } from '@mui/material';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts(prev => [...prev, newProduct]);
  };

  return (
    <>
      <CssBaseline />
      <Container>
        <ProductForm onProductAdded={handleProductAdded} />
        <ProductList products={products} />
      </Container>
    </>
  );
}

export default App;
