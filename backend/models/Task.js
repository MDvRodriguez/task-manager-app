/**
 * Modelo de Tarea
 * Contiene todas las operaciones de BD relacionadas con tareas
 */

const pool = require('../config/database');

class Task {
  /**
   * Crear una nueva tarea
   * @param {number} userId - ID del usuario propietario
   * @param {string} title - Título de la tarea
   * @param {string} description - Descripción
   * @param {string} priority - Prioridad (baja, media, alta)
   * @param {string} status - Estado (pendiente, en_progreso, completada)
   * @param {string} dueDate - Fecha límite (opcional)
   * @returns {Promise<Object>} - Datos de la tarea creada
   */
  static async create(userId, title, description, priority, status, dueDate = null) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        `INSERT INTO tasks (userId, title, description, priority, status, dueDate, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [userId, title, description, priority, status, dueDate]
      );

      return {
        id: result.insertId,
        userId,
        title,
        description,
        priority,
        status,
        dueDate,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener todas las tareas de un usuario
   * @param {number} userId - ID del usuario
   * @param {Object} filters - Filtros opcionales {priority, status, searchTerm}
   * @returns {Promise<Array>} - Array de tareas
   */
  static async getByUserId(userId, filters = {}) {
    const connection = await pool.getConnection();
    try {
      let query = 'SELECT * FROM tasks WHERE userId = ?';
      const params = [userId];

      // Filtrar por prioridad
      if (filters.priority && filters.priority !== 'todas') {
        query += ' AND priority = ?';
        params.push(filters.priority);
      }

      // Filtrar por estado
      if (filters.status && filters.status !== 'todas') {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      // Búsqueda por término
      if (filters.searchTerm) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        const searchTerm = `%${filters.searchTerm}%`;
        params.push(searchTerm, searchTerm);
      }

      // Ordenar por fecha de vencimiento y luego por prioridad
      query += ' ORDER BY dueDate ASC, FIELD(priority, "alta", "media", "baja") ASC, createdAt DESC';

      const [tasks] = await connection.query(query, params);
      return tasks;
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener una tarea por ID
   * @param {number} taskId - ID de la tarea
   * @param {number} userId - ID del usuario (para verificar pertenencia)
   * @returns {Promise<Object|null>}
   */
  static async getById(taskId, userId) {
    const connection = await pool.getConnection();
    try {
      const [tasks] = await connection.query(
        'SELECT * FROM tasks WHERE id = ? AND userId = ?',
        [taskId, userId]
      );

      return tasks.length > 0 ? tasks[0] : null;
    } finally {
      connection.release();
    }
  }

  /**
   * Actualizar una tarea
   * @param {number} taskId - ID de la tarea
   * @param {number} userId - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object>} - Tarea actualizada
   */
  static async update(taskId, userId, updates) {
    const connection = await pool.getConnection();
    try {
      // Verificar que la tarea pertenece al usuario
      const task = await this.getById(taskId, userId);
      if (!task) {
        throw new Error('Tarea no encontrada o no tienes permiso para editarla');
      }

      // Construir query dinámicamente
      const allowedFields = ['title', 'description', 'priority', 'status', 'dueDate'];
      const updateFields = [];
      const params = [];

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          updateFields.push(`${key} = ?`);
          params.push(value);
        }
      }

      if (updateFields.length === 0) {
        return task;
      }

      updateFields.push('updatedAt = NOW()');
      params.push(taskId, userId);

      const [result] = await connection.query(
        `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ? AND userId = ?`,
        params
      );

      if (result.affectedRows === 0) {
        throw new Error('No se pudo actualizar la tarea');
      }

      // Retornar tarea actualizada
      const updatedTask = await this.getById(taskId, userId);
      return updatedTask;
    } finally {
      connection.release();
    }
  }

  /**
   * Eliminar una tarea
   * @param {number} taskId - ID de la tarea
   * @param {number} userId - ID del usuario
   * @returns {Promise<boolean>} - True si se eliminó correctamente
   */
  static async delete(taskId, userId) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'DELETE FROM tasks WHERE id = ? AND userId = ?',
        [taskId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Tarea no encontrada o no tienes permiso para eliminarla');
      }

      return true;
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener estadísticas de tareas de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} - Estadísticas {total, completadas, pendientes, en_progreso}
   */
  static async getStats(userId) {
    const connection = await pool.getConnection();
    try {
      const [stats] = await connection.query(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'completada' THEN 1 ELSE 0 END) as completadas,
          SUM(CASE WHEN status = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
          SUM(CASE WHEN status = 'en_progreso' THEN 1 ELSE 0 END) as en_progreso
         FROM tasks 
         WHERE userId = ?`,
        [userId]
      );

      return stats[0];
    } finally {
      connection.release();
    }
  }
}

module.exports = Task;
