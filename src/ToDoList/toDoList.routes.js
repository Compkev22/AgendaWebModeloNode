import { Router } from 'express';
import {
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    changeTodoStatus
} from './toDoList.controller.js';
import {
    validateCreateTodo,
    validateUpdateTodo,
    validateTodoStatusChange,
    validateGetTodoById
} from '../../middlewares/toDoList-validators.js';
import { uploadToDoListImage } from '../../middlewares/file-uploaders.js';

const router = Router();

// Rutas GET
router.get('/', getTodos);
router.get('/:id', validateGetTodoById, getTodoById);

// Rutas POST
router.post(
    '/',
    uploadToDoListImage.single('image'),
    validateCreateTodo,
    createTodo
);

// Rutas PUT
router.put(
    '/:id',
    uploadToDoListImage.single('image'),
    validateUpdateTodo,
    updateTodo
);

router.put('/:id/activate', validateTodoStatusChange, changeTodoStatus);
router.put('/:id/desactivate', validateTodoStatusChange, changeTodoStatus);

export default router;