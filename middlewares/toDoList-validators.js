import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// Validaciones para crear tarea
export const validateCreateTodo = [
    body('title')
        .trim()
        .notEmpty().withMessage('El título es requerido')
        .isLength({ max: 100 }).withMessage('El título no puede exceder los 100 caracteres'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),
    body('status')
        .optional()
        .isIn(['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA']).withMessage('Estado no válido'),
    body('priority')
        .optional()
        .isIn(['BAJA', 'MEDIA', 'ALTA']).withMessage('Prioridad no válida'),
    checkValidators
];

// Validaciones para actualizar tarea
export const validateUpdateTodo = [
    param('id')
        .isMongoId().withMessage('ID no válido'),
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 }),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }),
    body('status')
        .optional()
        .isIn(['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA']),
    body('priority')
        .optional()
        .isIn(['BAJA', 'MEDIA', 'ALTA']),
    checkValidators
];

// Validaciones para activar/desactivar
export const validateTodoStatusChange = [
    param('id')
        .isMongoId().withMessage('ID no válido'),
    checkValidators
];

// Validación para buscar por ID
export const validateGetTodoById = [
    param('id')
        .isMongoId().withMessage('ID no válido'),
    checkValidators
];