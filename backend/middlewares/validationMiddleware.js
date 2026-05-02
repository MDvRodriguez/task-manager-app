/**
 * Middleware de validación de datos
 * Valida emails, contraseñas y otros campos antes de procesarlos
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }))
    });
  }
  next();
};

/**
 * Validaciones para registro de usuario
 */
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido'),
  handleValidationErrors
];

/**
 * Validaciones para login
 */
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  handleValidationErrors
];

/**
 * Validaciones para crear/editar tarea
 */
const validateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ max: 255 })
    .withMessage('El título no puede exceder 255 caracteres'),
  body('description')
    .optional()
    .trim(),
  body('priority')
    .isIn(['baja', 'media', 'alta'])
    .withMessage('La prioridad debe ser baja, media o alta'),
  body('status')
    .isIn(['pendiente', 'en_progreso', 'completada'])
    .withMessage('El estado debe ser pendiente, en_progreso o completada'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe ser válida'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateTask,
  handleValidationErrors
};
