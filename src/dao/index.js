import { CartManagerMongo } from '../dao/managers/mongoDB/cartManagerMongo.js'
import { ProductManagerMongo } from './managers/mongoDB/productManagerMongo.js'

const productService = new ProductManagerMongo();
const cartService = new CartManagerMongo();

export { productService, cartService }

