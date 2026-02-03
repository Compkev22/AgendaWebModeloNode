import Todo from './toDoList.model.js'; // Asegúrate de que tu modelo se llame 'todo.model.js'
import { cloudinary } from '../../middlewares/file-uploaders.js';

// 1. Obtener todas las tareas (con paginación)
export const getTodos = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const filter = { isActive}; // Solo tareas activas por defecto
        
        // Paginación
        const todos = await Todo.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Todo.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: todos,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las tareas',
            error: error.message
        });
    }
};

// 2. Obtener tarea por ID
export const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: todo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la tarea',
            error: error.message
        });
    }
};

// 3. Crear nueva tarea
export const createTodo = async (req, res) => {
    try {
        const data = req.body;

        // Validar si viene archivo
        if (req.file) {
            const extension = req.file.path.split('.').pop();
            const relativePath = req.file.filename;
            data.photo = `${relativePath}.${extension}`;
        }

        const todo = new Todo(data);
        await todo.save();

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: todo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear la tarea',
            error: error.message
        });
    }
};

// 4. Actualizar tarea
export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Gestión de imágenes
        if (req.file) {
            const currentTodo = await Todo.findById(id);
            
            // Si ya tenía foto, borrar la vieja de Cloudinary
            if (currentTodo && currentTodo.photo) {
                const publicId = currentTodo.photo.split('.')[0];
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (e) {
                    console.log('Error eliminando imagen anterior:', e);
                }
            }

            // Asignar nueva foto
            const extension = req.file.path.split('.').pop();
            data.photo = `${req.file.filename}.${extension}`;
        }
        
        const todo = await Todo.findByIdAndUpdate(id, data, { new: true });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tarea actualizada exitosamente',
            data: todo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la tarea',
            error: error.message
        });
    }
};

// 5. Cambiar estado de activación (Soft Delete o Activate)
export const changeTodoStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Detectamos si la ruta dice "activate" o "deactivate"
        const isActive = req.url.includes('/activate'); 
        
        const todo = await Todo.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: `Tarea ${isActive ? 'activada' : 'desactivada'} exitosamente`,
            data: todo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar el estado de la tarea',
            error: error.message
        });
    }
};