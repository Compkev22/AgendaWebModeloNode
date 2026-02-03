'use strict';

import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        // --------------------------------------------------------------------
        // MONITOREO
        // --------------------------------------------------------------------

        // Evento cuando ocurre un error en la conexión
        mongoose.connection.on('error', () => {
            console.log('MongoDB | no se pudo conectar a mongoDB');
            mongoose.disconnect(); // Cierra la conexión si falla
        });

        // Evento cuando se está intentando conectar
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | intentando conectar a mongoDB');
        });

        // Evento cuando se logra la conexión inicial
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | conectado a mongoDB');
        });

        // Evento cuando la conexión está abierta y lista para usarse
        mongoose.connection.on('open', () => {
            console.log('MongoDB | conectado a la base de datos kinalSports');
        });

        // Evento cuando se recupera la conexión tras una caída
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | reconectado a mongoDB');
        });

        // Evento cuando la base de datos se desconecta
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | desconectado de mongoDB');
        });

        // ---------------------------------------------------------
        // CONEXIÓN
        // ---------------------------------------------------------

        // Se usa la variable de entorno para conectar
        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS: 5000, // Tiempo de espera (5 seg)
            maxPoolSize: 10, // Máximo de conexiones simultáneas
        });
    } catch (error) {    
        console.log(`Error al conectar la db: ${error}`);
        process.exit(1);
    }
};



// Función para cerrar la conexión de forma limpia
const gracefulShutdown = async (signal) => {
    console.log(`MongoDB | Received ${signal}. Closing database connection...`);
    try {
        // Intenta cerrar la conexión con Mongoose
        await mongoose.connection.close();
        console.log('MongoDB | Database connection closed successfully');
        process.exit(0); // Salida exitosa (sin errores)
    } catch (error) {
        // Manejo de errores durante el cierre
        console.error('MongoDB | Error during graceful shutdown:', error.message);
        process.exit(1); // Salida con error
    }
};

//Manejadores de señales de proceso (Process signal handlers)
// Manejadores de señales corregidos
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));