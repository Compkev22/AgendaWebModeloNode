import { Router } from 'express';
import {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    changeContactStatus
} from './contact.controller.js';
import {
    validateCreateContact,
    validateUpdateContact,
    validateContactStatusChange,
    validateGetContactById
} from '../../middlewares/contact-validators.js';
// IMPORTANTE: Importar el uploader
import { uploadContactImage } from '../../middlewares/file-uploaders.js';

const router = Router();

router.get('/', getContacts);
router.get('/:id', validateGetContactById, getContactById);

// Ruta POST con imagen
router.post(
    '/',
    uploadContactImage.single('image'), // Middleware de Multer/Cloudinary
    validateCreateContact,
    createContact
);

// Ruta PUT con imagen
router.put(
    '/:id',
    uploadContactImage.single('image'), // Middleware de Multer/Cloudinary
    validateUpdateContact,
    updateContact
);

router.put('/:id/activate', validateContactStatusChange, changeContactStatus);
router.put('/:id/desactivate', validateContactStatusChange, changeContactStatus);

export default router;