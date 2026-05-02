/**
 * Middleware de autenticación con JWT
 * Verifica que el token sea válido y extrae la información del usuario
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware para proteger rutas
 * Verifica que exista un token JWT válido en los headers
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guardar información del usuario en la request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

module.exports = authMiddleware;
