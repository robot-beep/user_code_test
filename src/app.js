const express = require('express');
const { sequelize } = require('./database/config');
require('./models'); // Importar modelos
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


const DbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('Models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

DbConnection();


app.use('/products', productRoutes);
app.use('/upload', uploadRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

module.exports = app;
