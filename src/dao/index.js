import { CartManagerMongo } from '../dao/managers/mongoDB/cartManagerMongo.js'
import { productsDaoMongo } from './managers/mongoDB/productManagerMongo.js'
import { UsersManagerMongo } from './managers/mongoDB/usersManagerMongo.js';

const productsDao = new productsDaoMongo();
const cartService = new CartManagerMongo();
const usersDao = new UsersManagerMongo();


export { productsDao, cartService, usersDao }

