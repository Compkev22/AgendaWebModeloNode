'use strict';

import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'El título de la tarea es obligatorio'],
        trim: true,
        maxLength: [100, 'El título no puede exceder los 100 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, 'La descripción no puede exceder los 500 caracteres']
    },
    status: {
        type: String,
        enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'],
        default: 'PENDIENTE'
    },
    priority: {
        type: String,
        enum: ['BAJA', 'MEDIA', 'ALTA'],
        default: 'MEDIA'
    },
    photo: { // <--- NUEVO CAMPO
        type: String,
        default: null // Puede ser null si no hay imagen, o una por defecto
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Todo', todoSchema);