const express = require('express');
const contactRouter = express.Router();
const Contact = require('../models/contact');
const jwt = require('jsonwebtoken');
const SECRET = 'tu_clave_secreta'; // Usa una variable de entorno en producción

// Middleware para verificar JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ mensaje: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ mensaje: 'Token inválido' });
    req.user = decoded;
    next();
  });
}

// Obtener todos los contactos
contactRouter.get('/', async (req, res) => {
  const contacts = await Contact.findAll({
    attributes: { exclude: ['contraseña'] }
  });
  res.json(contacts);
});

// Obtener contacto por ID
contactRouter.get('/:id', async (req, res) => {
  const contact = await Contact.findByPk(req.params.id, {
    attributes: { exclude: ['contraseña'] }
  });
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end();
  }
});

// Registrar contacto
contactRouter.post('/', async (req, res, next) => {
  try {
    const { name, number, correo, contraseña, role, nombre, numero } = req.body;
    const finalName = name || nombre;
    const finalNumber = number || numero;

    if (!finalName || !finalNumber || !correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Se requieren nombre, número, correo y contraseña' });
    }

    const newContact = await Contact.create({
      name: finalName,
      number: finalNumber,
      correo,
      contraseña,
      role: role || 'user'
    });

    const { contraseña: _, ...usuario } = newContact.toJSON();
    return res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario });
  } catch (error) {
    console.error('Error creando contacto:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'Correo o número ya registrado' });
    }
    return next(error);
  }
});

// Eliminar contacto
contactRouter.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Contact.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// Actualizar número
contactRouter.put('/:id/number', async (req, res, next) => {
  try {
    const updated = await Contact.update(
      { number: req.body.number },
      { where: { id: req.params.id }, returning: true }
    );
    if (updated[0]) {
      const contact = await Contact.findByPk(req.params.id, {
        attributes: { exclude: ['contraseña'] }
      });
      res.json(contact);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// Login
contactRouter.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  const user = await Contact.findOne({ where: { correo } });
  if (!user || user.contraseña !== contraseña) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }
  const token = jwt.sign({ id: user.id, correo: user.correo }, SECRET, { expiresIn: '1h' });
  const { contraseña: _, ...userWithoutPassword } = user.toJSON();
  res.json({ user: userWithoutPassword, token });
});

// Ejemplo de uso de la ruta protegida
contactRouter.get('/protegida', verifyToken, async (req, res) => {
  res.json({ mensaje: 'Ruta protegida', usuario: req.user });
});

module.exports = contactRouter;
