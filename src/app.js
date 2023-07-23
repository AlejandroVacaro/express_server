import express from 'express';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import path from 'path';
import { router as viewsRouter } from './routes/views.routes.js';
import { Server } from 'socket.io';


const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

//se levanta el servidor local 8080 y se guarda en una variable
const httpServer = app.listen(port, () => console.log(`Server started on port ${port}`));

//configuración de handlebars
app.engine('.hbs', handlebars.engine({ extname: '.hbs' })); //inicia el motor de plantillas handlebars
app.set('view engine', '.hbs'); //indica que motor vamos a utilizar
app.set('views', path.join(__dirname, '/views')); //ruta de la carpeta de vistas


// se crea el servidor de websocket
export const socketServer = new Server(httpServer);

//crear el canal de comunicación, se detecta el handshake
socketServer.on('connection', (socketConnected) => {
    console.log(`Cliente conectado: ${socketConnected.id}`)
})


//routes

app.use(viewsRouter);