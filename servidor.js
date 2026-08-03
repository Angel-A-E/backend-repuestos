const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB en Railway
const MONGO_URI = process.env.MONGO_URL || "mongodb://mongo:WMoYmLhWgXMzkLFpIdhqzwpKYCgVFAaI@altaria.proxy.rlwy.net:37634";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB en Railway'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Esquema de Repuestos
const PartSchema = new mongoose.Schema({
  part_name: String,
  car_brand: String,
  car_model: String,
  car_year: String,
  price: Number,
  store_name: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});

const Part = mongoose.model('Part', PartSchema);

// Rutas de la API
app.get('/api/parts', async (req, res) => {
  try {
    const parts = await Part.find().sort({ createdAt: -1 });
    res.json(parts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/parts', async (req, res) => {
  try {
    const newPart = new Part(req.body);
    await newPart.save();
    res.status(201).json(newPart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor listo en el puerto ${PORT}`));