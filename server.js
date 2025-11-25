const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware para analizar cuerpos de solicitud JSON
app.use(bodyParser.json());

// --- "Base de Datos" Simple en Memoria ---
let users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 }
];
let nextId = 3; // Contador para asignar nuevos IDs

// --- Middleware de Validación de Usuario ---

/**
 * Valida los datos del usuario (name, email, age) en el cuerpo de la solicitud.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware/ruta.
 */
const validateUser = (req, res, next) => {
    const { name, email, age } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'El nombre es obligatorio y debe ser una cadena de texto válida.' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'El correo electrónico es obligatorio y debe tener un formato válido.' });
    }

    // Comprobación de edad opcional/adicional
    if (age !== undefined && (typeof age !== 'number' || age < 18)) {
        return res.status(400).json({ error: 'La edad debe ser un número y el usuario debe ser mayor de 18 años.' });
    }

    // Los datos son válidos, pasar al siguiente manejador de ruta
    next();
};

// --- Puntos Finales CRUD ---

// 1. GET /users (Leer todos los usuarios)
app.get('/users', (req, res) => {
    console.log('GET /users solicitado.');
    res.status(200).json(users);
});

// 2. GET /users/:id (Leer un usuario por ID)
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: 'Usuario no encontrado.' });
    }
});

// 3. POST /users (Crear un nuevo usuario)
// El middleware validateUser se aplica ANTES de la función de ruta principal.
app.post('/users', validateUser, (req, res) => {
    const newUser = {
        id: nextId++,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age // Ya validado por validateUser
    };

    // Verificar si el correo electrónico ya existe antes de añadir
    if (users.some(u => u.email === newUser.email)) {
         return res.status(409).json({ error: 'El correo electrónico ya está registrado.' }); // 409 Conflict
    }

    users.push(newUser);
    res.status(201).json(newUser); // 201 Created
});

// 4. PUT /users/:id (Actualizar un usuario existente)
// El middleware validateUser se aplica ANTES de la función de ruta principal.
app.put('/users/:id', validateUser, (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index !== -1) {
        // El usuario existe
        const updatedUser = {
            ...users[index], // Mantener campos existentes (como el ID)
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        };

        // Verificar si el nuevo correo electrónico ya está en uso por OTRO usuario
        if (users.some((u, i) => u.email === updatedUser.email && i !== index)) {
             return res.status(409).json({ error: 'El correo electrónico ya está registrado por otro usuario.' }); // 409 Conflict
        }


        users[index] = updatedUser;
        res.status(200).json(updatedUser);
    } else {
        res.status(404).json({ error: 'Usuario no encontrado para actualizar.' });
    }
});

// 5. DELETE /users/:id (Eliminar un usuario)
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = users.length;

    // Filtra el usuario con el ID especificado
    users = users.filter(u => u.id !== id);

    if (users.length < initialLength) {
        // Se eliminó un usuario
        res.status(204).send(); // 204 No Content (Éxito sin devolver contenido)
    } else {
        res.status(404).json({ error: 'Usuario no encontrado para eliminar.' });
    }
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 API de gestión de usuarios ejecutándose en http://localhost:${PORT}`);
});