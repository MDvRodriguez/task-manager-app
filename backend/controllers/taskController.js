const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.create(userId, title, description || '', priority, status, dueDate || null);

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: { task }
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ success: false, message: 'Error al crear la tarea' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { priority, status, search } = req.query;

    const filters = {
      priority: priority || 'todas',
      status: status || 'todas',
      searchTerm: search || ''
    };

    const tasks = await Task.getByUserId(userId, filters);

    res.json({ success: true, data: { tasks } });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las tareas' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: taskId } = req.params;

    const task = await Task.getById(taskId, userId);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }

    res.json({ success: true, data: { task } });
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ success: false, message: 'Error al obtener la tarea' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: taskId } = req.params;
    const { title, description, priority, status, dueDate } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate;

    const task = await Task.update(taskId, userId, updates);

    res.json({ success: true, message: 'Tarea actualizada exitosamente', data: { task } });
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar la tarea' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: taskId } = req.params;

    await Task.delete(taskId, userId);

    res.json({ success: true, message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar la tarea' });
  }
};

exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await Task.getStats(userId);

    res.json({ success: true, data: { stats } });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
};