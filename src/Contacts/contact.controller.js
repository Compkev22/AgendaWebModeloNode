import Contact from './contact.model.js';
import { cloudinary } from '../../middlewares/file-uploaders.js';

// 1. Obtener todos los contactos (con paginación)
export const getContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        const filter = { isActive };

        const contacts = await Contact.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Contact.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los contactos',
            error: error.message
        });
    }
};

// 2. Obtener contacto por ID (LA QUE TE FALTABA)
export const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contacto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el contacto',
            error: error.message
        });
    }
};

// 3. Crear nuevo contacto (Sin imagen, según tus requisitos)
export const createContact = async (req, res) => {
    try {
        const data = req.body;
        
        if (req.file) {
            const extension = req.file.path.split('.').pop();
            // Guardamos la ruta relativa o el nombre que nos da Cloudinary
            const relativePath = req.file.filename; 
            data.photo = `${relativePath}.${extension}`;
        }

        const contact = new Contact(data);
        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Contacto creado exitosamente',
            data: contact
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear el contacto',
            error: error.message
        });
    }
};

// 4. Actualizar contacto
export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Si suben una nueva imagen, hay que borrar la anterior
        if (req.file) {
            const currentContact = await Contact.findById(id);
            
            // Si tiene foto y no es la default, la borramos de Cloudinary
            if (currentContact && currentContact.photo && !currentContact.photo.includes('default_profile')) {
                const photoName = currentContact.photo.split('.')[0]; // Quitamos extensión
                // Intentamos borrar (el try/catch interno evita que falle todo si la foto no existe en la nube)
                try {
                     await cloudinary.uploader.destroy(photoName);
                } catch (e) {
                    console.log('Error borrando imagen antigua:', e);
                }
            }

            // Asignamos la nueva foto
            const extension = req.file.path.split('.').pop();
            data.photo = `${req.file.filename}.${extension}`;
        }
        
        const contact = await Contact.findByIdAndUpdate(id, data, { new: true });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contacto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contacto actualizado exitosamente',
            data: contact
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar el contacto',
            error: error.message
        });
    }
};

// 5. Cambiar estado (Activar/Desactivar)
export const changeContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const isActive = req.url.includes('/activate'); // true si la ruta es activate
        
        const contact = await Contact.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contacto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: `Estado del contacto actualizado a ${isActive ? 'activo' : 'inactivo'}`,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar el estado del contacto',
            error: error.message
        });
    }
};