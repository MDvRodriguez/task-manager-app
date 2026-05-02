const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await User.create(email, password, firstName, lastName);
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }, token }
    });
  } catch (error) {
    if (error.message.includes('email ya está registrado')) {
      return res.status(409).json({ success: false, message: error.message });
    }
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
    }

    const isPasswordValid = await User.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }, token }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ success: false, message: 'Error al obtener información del usuario' });
  }
};

exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logout exitoso. Por favor, elimina el token del cliente.' });
};