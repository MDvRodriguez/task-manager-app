/**
 * Servidor Principal - Task Manager API
 * Express server con todas las configuraciones necesarias
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Inicializar app
const app = express();

// ===== MIDDLEWARES =====

/**
 * CORS - Permitir requests desde el frontend
 */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Body parser - Parsear JSON en requests
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Middleware de logging (opcional pero recomendado)
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ===== RUTAS =====

/**
 * Ruta de prueba (health check)
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

/**
 * Rutas de autenticación
 */
app.use('/api/auth', authRoutes);

/**
 * Rutas de tareas
 */
app.use('/api/tasks', taskRoutes);

// ===== MANEJO DE ERRORES =====

/**
 * Ruta 404 - No encontrado
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

/**
 * Manejo global de errores
 */
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: error.stack })
  });
});

// ===== INICIAR SERVIDOR =====

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Task Manager API - Servidor ejecutando   ║
║        🚀 http://localhost:${PORT}           ║
╚════════════════════════════════════════════╝
  `);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS activado para: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

module.exports = app;
