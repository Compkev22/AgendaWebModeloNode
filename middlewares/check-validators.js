import { validationResult } from "express-validator";

export const checkValidators = (req, res, next) => {
    // 1. Debemos capturar los resultados de la validación primero
    const errors = validationResult(req); 

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'error de validacion',
            errors: errors.array().map(error => ({ // Cambié "error" por "errors" para ser consistentes
                field: error.path || error.param,
                message: error.msg
            }))
        });
    }
    next();
};