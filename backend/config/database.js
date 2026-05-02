/**
 * Configuración de conexión a base de datos MySQL
 * Usa pool de conexiones para mejor rendimiento
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear pool de conexiones para mejor manejo de conexiones concurrentes
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_manager_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

/**
 * Prueba de conexión a la BD
 */
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión a MySQL exitosa');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar a MySQL:', err.message);
    process.exit(1);
  });

module.exports = pool;
