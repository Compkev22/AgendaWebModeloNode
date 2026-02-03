'use strict';

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxLength: [50, 'El nombre no puede exceder los 50 caracteres']
    },
    alias: {
        type: String,
        trim: true,
        maxLength: [50, 'El alias no puede exceder los 50 caracteres']
    },
    phoneNumber: {
        type: String,
        required: [true, 'El número de teléfono es obligatorio'],
        trim: true,
        minLength: [8, 'El número debe tener al menos 8 dígitos'],
        maxLength: [15, 'El número no puede exceder los 15 dígitos']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        trim: true,
        unique: true, 
        lowercase: true
    },
    photo: { // <--- NUEVO CAMPO
        type: String,
        default: 'contacts/default_profile' // Valor por defecto si no suben foto
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Contact', contactSchema);