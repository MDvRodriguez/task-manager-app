/**
 * Rutas de Tareas
 * Endpoints para operaciones CRUD de tareas
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateTask } = require('../middlewares/validationMiddleware');

// Aplicar autenticación a todas las rutas de tareas
router.use(authMiddleware);

/**
 * POST /api/tasks
 * Crear nueva tarea
 * Body: { title, description, priority, status, dueDate }
 */
router.post('/', validateTask, taskController.createTask);

/**
 * GET /api/tasks
 * Obtener todas las tareas del usuario
 * Query params: ?priority=alta&status=pendiente&search=buscar
 */
router.get('/', taskController.getTasks);

/**
 * GET /api/tasks/stats/summary
 * Obtener estadísticas de tareas
 * Nota: Esta ruta debe ir ANTES de /:id para evitar conflicto
 */
router.get('/stats/summary', taskController.getTaskStats);

/**
 * GET /api/tasks/:id
 * Obtener una tarea específica
 */
router.get('/:id', taskController.getTaskById);

/**
 * PUT /api/tasks/:id
 * Actualizar una tarea
 * Body: { title?, description?, priority?, status?, dueDate? }
 */
router.put('/:id', validateTask, taskController.updateTask);

/**
 * DELETE /api/tasks/:id
 * Eliminar una tarea
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;
