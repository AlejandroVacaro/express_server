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
import { generateRandomProducts } from './utils/helpers.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { addLogger } from './utils/loggers.js';
import { swaggerSpecs } from './config/swagger.config.js';
import swaggerUi from 'swagger-ui-express';
import { usersRouter } from './routes/users.routes.js';

// Inicialización de la aplicación express
const app = express();
// Definición del puerto en el que se ejecutará la aplicación
const port = config.server.port;

// Configuración de los loggers
const logger = addLogger();

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

// Definición de la ruta para modificar el rol de un usuario
app.use('/api/users', usersRouter);

// Definición de la ruta para generar productos aleatorios con Faker
app.get('/api/mockingproducts', (req, res) => {
    let products = [];
    for (let i = 0; i < 100; i++) {
        products.push(generateRandomProducts());
    };
    res.json({status: 'success', data: products});
});

// Definición de la ruta para generar loggers
app.get('/loggerTest', (req, res) => {
    logger.debug('Mensaje de error nivel debug');
    logger.http('Mensaje de error nivel http');
    logger.info('Mensaje de error nivel info');
    logger.warning('Mensaje de error nivel warning');
    logger.error('Mensaje de error nivel error');
    logger.fatal('Mensaje de error nivel fatal');
    res.send('Petición recibida');
});

// Inicialización del servidor HTTP
const httpServer = app.listen(port, () => logger.info(`Server started on port ${port}`));

//Conexión a la Base de Datos
connectDB();

// Configuración del motor de plantillas Handlebars
app.engine('.hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
// Definición del directorio de las vistas
app.set('views', path.join(__dirname, '/views'));

// Manejo de errores
app.use(errorHandler);

// Configuración de Swagger para la documentación de la API
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Se exporta la aplicación para poder testearla
export default app;
