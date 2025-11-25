const express = require('express');
const userData = require('../data/users');
const { createUserValidation, updateUserValidation } = require('../middlewares/validation');
const router = express.Router();

// --- PUNTOS FINALES CRUD ---

// GET /api/users
router.get('/', (req, res) => {
    res.json(userData.getAll());
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = userData.getById(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'Usuario no encontrado.' });
    }
});

// POST /api/users (Usa el middleware de validación)
router.post('/', createUserValidation, (req, res) => {
    const newUser = userData.create(req.body);
    res.status(201).json(newUser);
});

// PUT /api/users/:id (Usa el middleware de validación)
router.put('/:id', updateUserValidation, (req, res) => {
    const id = parseInt(req.params.id);
    if (!userData.getById(id)) {
        return res.status(404).json({ error: 'Usuario no encontrado para actualizar.' });
    }
    const updatedUser = userData.update(id, req.body);
    res.json(updatedUser);
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = userData.remove(id);
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Usuario no encontrado para eliminar.' });
    }
});

module.exports = router;