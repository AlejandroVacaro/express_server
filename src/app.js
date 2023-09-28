import express from 'express';
import { config } from './config/config.js';
import { connectDB } from './config/dbConnection.js';
import { __dirname } from './utils.js';
import path from 'path';
import { router as viewsRouter } from './routes/views.routes.js';
import { sessionsRouter } from './routes/sessions.routes.js';
import productRoutes from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { initializePassport } from './config/passportConfig.js';
import passport from 'passport';



// Inicialización de la aplicación express
const app = express();
// Definición del puerto en el que se ejecutará la aplicación
const port = config.server.port;

// Configuración de los archivos estáticos en el directorio 'public'
app.use(express.static(path.join(__dirname, '/public')));

// Middleware para el manejo de solicitudes con cuerpo en formato JSON
app.use(express.json());
// Middleware para el manejo de solicitudes con cuerpo en formato urlencoded
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    store: MongoStore.create({ 
        ttl: 60,
        mongoUrl: config.mongo.url
     }),
    secret: config.server.secretSession,
    resave: true,
    saveUninitialized: true
}));

// Inicialización de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


// Definición de las rutas para los productos
app.use('/api/products', productRoutes);

// Definición de las rutas para los carritos
app.use('/api/carts', cartsRouter);

// Definición de las rutas para las vistas
app.use(viewsRouter);

// Definición de la ruta para las sesiones
app.use('/api/sessions', sessionsRouter);


// Inicialización del servidor HTTP
const httpServer = app.listen(port, () => console.log(`Server started on port ${port}`));

//Conexión a la Base de Datos
connectDB();

// Configuración del motor de plantillas Handlebars
app.engine('.hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
// Definición del directorio de las vistas
app.set('views', path.join(__dirname, '/views'));
