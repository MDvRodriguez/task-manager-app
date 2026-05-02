/**
 * Modelo de Usuario
 * Contiene todas las operaciones de BD relacionadas con usuarios
 */

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Crear un nuevo usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña sin encriptar
   * @param {string} firstName - Nombre
   * @param {string} lastName - Apellido
   * @returns {Promise<Object>} - Datos del usuario creado
   */
  static async create(email, password, firstName, lastName) {
    const connection = await pool.getConnection();
    try {
      // Verificar si el usuario ya existe
      const [existingUser] = await connection.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        throw new Error('El email ya está registrado');
      }

      // Encriptar contraseña con bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar nuevo usuario
      const [result] = await connection.query(
        'INSERT INTO users (email, password, firstName, lastName, createdAt) VALUES (?, ?, ?, ?, NOW())',
        [email, hashedPassword, firstName, lastName]
      );

      return {
        id: result.insertId,
        email,
        firstName,
        lastName,
        createdAt: new Date()
      };
    } finally {
      connection.release();
    }
  }

  /**
   * Encontrar usuario por email
   * @param {string} email - Email a buscar
   * @returns {Promise<Object|null>} - Datos del usuario o null
   */
  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      return users.length > 0 ? users[0] : null;
    } finally {
      connection.release();
    }
  }

  /**
   * Encontrar usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object|null>} - Datos del usuario o null
   */
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        'SELECT id, email, firstName, lastName, createdAt FROM users WHERE id = ?',
        [id]
      );

      return users.length > 0 ? users[0] : null;
    } finally {
      connection.release();
    }
  }

  /**
   * Verificar contraseña
   * @param {string} password - Contraseña en texto plano
   * @param {string} hashedPassword - Contraseña encriptada
   * @returns {Promise<boolean>}
   */
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
