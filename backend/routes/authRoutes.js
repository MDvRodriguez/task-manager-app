/**
 * Rutas de Autenticación
 * Endpoints para registro, login y obtener usuario actual
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../middlewares/validationMiddleware');

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 * Body: { email, password, firstName, lastName }
 */
router.post('/register', validateRegister, authController.register);

/**
 * POST /api/auth/login
 * Iniciar sesión
 * Body: { email, password }
 */
router.post('/login', validateLogin, authController.login);

/**
 * GET /api/auth/me
 * Obtener información del usuario autenticado
 * Headers: Authorization: Bearer {token}
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * POST /api/auth/logout
 * Cerrar sesión (opcional - principalmente en cliente)
 */
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
