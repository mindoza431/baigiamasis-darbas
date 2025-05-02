const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
console.log('Bandoma įkelti .env failą iš:', envPath);
dotenv.config({ path: envPath });

if (!process.env.JWT_SECRET) {
  console.error('KLAIDA: JWT_SECRET nėra nustatytas .env faile');
  console.log('Dabartinės aplinkos kintamųjų reikšmės:', {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
  });
  process.exit(1);
}

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Prisijungta prie MongoDB'))
  .catch(err => {
    console.error('MongoDB prisijungimo klaida:', err);
    process.exit(1);
  });

app.use('/api/auth', require('../routes/auth'));
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/products'));
app.use('/api/orders', require('../routes/orderRoutes'));



app.use((err, req, res, next) => {
  console.error('Serverio klaida:', err);
  res.status(500).json({ message: 'Serverio klaida' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveris paleistas portu ${PORT}`)); 