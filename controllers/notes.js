const express = require('express');
const notesRouter = express.Router();
const Note = require('../models/note');

// Obtener todas las notas
notesRouter.get('/', async (req, res) => {
  const notes = await Note.findAll();
  res.json(notes);
});

// Crear nota
notesRouter.post('/', async (req, res, next) => {
  try {
    const { content, important } = req.body;
    const note = await Note.create({ content, important });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;