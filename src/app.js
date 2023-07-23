import express from 'express';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import path from 'path';
import { router as viewsRouter } from './routes/views.routes.js';
import { Server } from 'socket.io';

// Inicialización de la aplicación express
const app = express();
// Definición del puerto en el que se ejecutará la aplicación
const port = 8080;

// Configuración de los archivos estáticos en el directorio 'public'
app.use(express.static(path.join(__dirname, '/public')));

// Middleware para el manejo de solicitudes con cuerpo en formato JSON
app.use(express.json());
// Middleware para el manejo de solicitudes con cuerpo en formato urlencoded
app.use(express.urlencoded({ extended: true }));

// Definición de las rutas para los productos y carritos
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Inicialización del servidor HTTP
const httpServer = app.listen(port, () => console.log(`Server started on port ${port}`));

// Configuración del motor de plantillas Handlebars
app.engine('.hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
// Definición del directorio de las vistas
app.set('views', path.join(__dirname, '/views'));

// Inicialización del servidor Socket.io para permitir la comunicación en tiempo real
export const socketServer = new Server(httpServer);

// Registro del evento de conexión para Socket.io
socketServer.on('connection', (socketConnected) => {
    console.log(`Cliente conectado: ${socketConnected.id}`)
})

// Definición de las rutas para las vistas
app.use(viewsRouter);
