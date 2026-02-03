'use strict';

//Importaciones
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { corsOptions } from './cors-configuration.js'; // Agregué el .js, es buena práctica en módulos
import { dbConnection} from './db.js';

//Rutas
//faltan rutas
const BASE_URL = '/agendaweb/v1';
import contactRoutes from '../src/Contacts/contact.router.js';
import toDoListRoutes from '../src/ToDoList/toDoList.routes.js';

const middleware = (app) => {
    //Limitamos el acceso y el tamaño de las consultas
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    //Las consultas Json tendrán un tamaño máximo de 10mb
    app.use(express.json({ limit: '10mb' }));
    //Importamos los métodos creados anteriormente
    app.use(cors(corsOptions));
    //Morgan nos ayudará a detectar errores del lado del usuario
    app.use(morgan('dev'));
}

//Integracion de todas las rutas
const routes = (app) => {
    app.use(`${BASE_URL}/contacts`, contactRoutes);
    app.use(`${BASE_URL}/todolist`, toDoListRoutes);

}




const initServer = async () => { 
    const app = express();
    const PORT = process.env.PORT || 3001;

    try {
        // 1. Conectar a DB (Usa await para esperar la conexión)
        await dbConnection(); 
        
        // 2. Configurar Middlewares
        middleware(app); 
        
        // 3. Configurar Rutas (Incluyendo el health check)
        routes(app);

        // Mueve el app.get del health check AQUÍ (antes del listen)
        app.get(`${BASE_URL}/health`, (req, res) => {
            res.status(200).json({ status: 'ok', service: 'AgendaWeb Admin' });
        });

        // 4. Iniciar escucha
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

export { initServer };