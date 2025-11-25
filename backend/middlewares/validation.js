const { body, validationResult } = require('express-validator');
const userData = require('../data/users');

// Manejador de errores que verifica el resultado de la validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Devuelve un error 400 con los detalles de la validación
        return res.status(400).json({ validationErrors: errors.array() });
    }
    next();
};

// Reglas de validación base (reutilizables para POST y PUT)
const userValidationRules = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isString().withMessage('El nombre debe ser una cadena de texto.'),
    
    body('email')
        .isEmail().withMessage('El email debe ser válido.')
        .normalizeEmail(),

    body('age')
        .optional()
        .isInt({ min: 18 }).withMessage('La edad debe ser un número entero mayor o igual a 18.'),
];

// Reglas específicas para la creación (POST)
const createUserValidation = [
    ...userValidationRules,
    body('email').custom(value => {
        if (userData.findByEmail(value)) {
            throw new Error('El correo electrónico ya está registrado.');
        }
        return true;
    }),
    handleValidationErrors
];

// Reglas específicas para la actualización (PUT)
const updateUserValidation = [
    ...userValidationRules,
    body('email').custom((value, { req }) => {
        const id = parseInt(req.params.id);
        const userExists = userData.getList().some(u => u.email === value && u.id !== id);
        if (userExists) {
            throw new Error('El correo electrónico ya está registrado por otro usuario.');
        }
        return true;
    }),
    handleValidationErrors
];

module.exports = {
    createUserValidation,
    updateUserValidation
};