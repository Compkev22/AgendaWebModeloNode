import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// Validaciones para crear contacto
export const validateCreateContact = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ max: 50 }).withMessage('El nombre no puede exceder los 50 caracteres'),
    body('alias')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('El alias no puede exceder los 50 caracteres'),
    body('phoneNumber')
        .trim()
        .notEmpty().withMessage('El número de teléfono es requerido')
        .isLength({ min: 8, max: 15 }).withMessage('El número debe tener entre 8 y 15 caracteres')
        .isNumeric().withMessage('El teléfono solo debe contener números'),
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es requerido')
        .isEmail().withMessage('Debe ingresar un correo válido'),
    checkValidators
];

// Validaciones para actualizar contacto
export const validateUpdateContact = [
    param('id')
        .isMongoId().withMessage('ID no válido'),
    body('name')
        .optional()
        .trim()
        .isLength({ max: 50 }),
    body('alias')
        .optional()
        .trim()
        .isLength({ max: 50 }),
    body('phoneNumber')
        .optional()
        .trim()
        .isLength({ min: 8, max: 15 })
        .isNumeric(),
    body('email')
        .optional()
        .trim()
        .isEmail(),
    checkValidators
];

// Validaciones para activar/desactivar
export const validateContactStatusChange = [
    param('id')
        .isMongoId().withMessage('ID no válido'),
    checkValidators
];

// Validación para buscar por ID
export const validateGetContactById = [
    param('id')
        .isMongoId().withMessage('ID no válido'),
    checkValidators
];