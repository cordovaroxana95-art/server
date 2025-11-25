const express = require('express');
const userRoutes = require('./routes/users');
const loggerMiddleware = require('./middlewares/logger');
const cors = require('cors'); // Necesario para permitir al frontend acceder al backend

const app = express();
const PORT = 3000;

// --- Middlewares Globales ---

// Permite peticiones desde el frontend (puertos diferentes)
app.use(cors()); 

// Middleware de Logging (APLICADO A TODAS LAS RUTAS)
app.use(loggerMiddleware);

// Middleware para analizar JSON
app.use(express.json()); 

// Middleware para servir rutas de usuarios (Prefijo /api/users)
app.use('/api/users', userRoutes);

// Manejador de errores para rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta de API no encontrada.' });
});

// Manejador de errores global (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor.' });
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 API de Gestión de Usuarios ejecutándose en http://localhost:${PORT}`);
});