const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Configuración de Middlewares (CORS abierto para React Native / Expo / Appetize)
app.use(cors({ origin: '*' }));
app.use(express.json());

// 2. Conexión Flexible a MongoDB (Lee cualquier variable que le ponga Railway)
const MONGO_URI = 
  process.env.MONGO_PUBLIC_URL || 
  process.env.MONGO_URL || 
  process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR CRÍTICO: No se encontró la variable de entorno de MongoDB en Railway.");
} else {
  console.log("🔄 Intentando conectar a MongoDB...");
  mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado exitosamente a MongoDB"))
    .catch((err) => console.error("❌ Error conectando a MongoDB:", err.message));
}

// 3. Esquema y Modelo de Repuesto en Mongoose
const RepuestoSchema = new mongoose.Schema({
  part_name: { type: String, required: true },
  car_brand: { type: String, default: '' },
  car_model: { type: String, default: '' },
  year: { type: Number, default: 2022 },
  price: { type: Number, required: true },
  store_name: { type: String, default: 'AutoRepuestos La Romana' },
  store_address: { type: String, default: 'Av. Principal #100' },
}, { timestamps: true });

const Repuesto = mongoose.model('Repuesto', RepuestoSchema);

// 4. RUTAS API

// Ruta raíz de prueba (Para verificar desde la web)
app.get('/', (req, res) => {
  res.status(200).send('🚀 Servidor de Repuestos funcionando correctamente en Railway.');
});

// GET: Obtener todos los repuestos
app.get('/api/repuestos', async (req, res) => {
  try {
    const repuestos = await Repuesto.find().sort({ createdAt: -1 });
    return res.status(200).json(repuestos);
  } catch (error) {
    console.error('Error al obtener repuestos:', error.message);
    return res.status(500).json({ message: 'Error en el servidor al obtener repuestos.', error: error.message });
  }
});

// POST: Crear/Publicar un nuevo repuesto
app.post('/api/repuestos', async (req, res) => {
  try {
    const { part_name, car_brand, car_model, year, price, store_name, store_address } = req.body;

    // Validación de campos requeridos
    if (!part_name || price === undefined || price === null) {
      return res.status(400).json({ message: 'El nombre del repuesto y el precio son obligatorios.' });
    }

    const nuevoRepuesto = new Repuesto({
      part_name,
      car_brand: car_brand || '',
      car_model: car_model || '',
      year: parseInt(year) || 2022,
      price: parseFloat(price) || 0,
      store_name: store_name || 'AutoRepuestos La Romana',
      store_address: store_address || 'Av. Principal #100',
    });

    await nuevoRepuesto.save();
    console.log('📦 Repuesto guardado con éxito:', nuevoRepuesto.part_name);
    
    // RESPUESTA OBLIGATORIA (Evita que la app se quede en loading)
    return res.status(201).json({ message: 'Repuesto publicado con éxito', data: nuevoRepuesto });

  } catch (error) {
    console.error('Error al guardar repuesto:', error.message);
    return res.status(500).json({ message: 'Error al guardar repuesto en la base de datos.', error: error.message });
  }
});

// 5. Encendido del Servidor en el Puerto de Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
