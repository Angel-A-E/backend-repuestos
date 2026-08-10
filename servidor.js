const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares obligatorios
app.use(cors({ origin: '*' }));
app.use(express.json());

// Acepta tanto MONGO_URI como MONGO_URL o la red privada de Railway
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

if (!MONGO_URI) {
  console.error("❌ No se encontró ninguna variable de MongoDB.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado exitosamente a MongoDB en Railway"))
    .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));
}

// Esquema del Repuesto
const RepuestoSchema = new mongoose.Schema({
  part_name: String,
  car_brand: String,
  car_model: String,
  year: Number,
  price: Number,
  store_name: String,
  store_address: String
}, { timestamps: true });

const Repuesto = mongoose.model('Repuesto', RepuestoSchema);

// Ruta de prueba para verificar desde el navegador
app.get('/', (req, res) => {
  res.send('Servidor en Railway funcionando correctamente 🚀');
});

// GET: Obtener repuestos
app.get('/api/repuestos', async (req, res) => {
  try {
    const repuestos = await Repuesto.find().sort({ createdAt: -1 });
    return res.status(200).json(repuestos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST: Publicar repuesto
app.post('/api/repuestos', async (req, res) => {
  try {
    const { part_name, car_brand, car_model, year, price, store_name, store_address } = req.body;
    
    const nuevoRepuesto = new Repuesto({
      part_name: part_name || 'Sin nombre',
      car_brand: carBrand || '',
      car_model: carModel || '',
      year: Number(year) || 2022,
      price: Number(price) || 0,
      store_name: store_name || 'AutoRepuestos La Romana',
      store_address: store_address || 'Av. Principal #100'
    });

    await nuevoRepuesto.save();
    return res.status(201).json({ message: "Guardado con éxito", data: nuevoRepuesto });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
