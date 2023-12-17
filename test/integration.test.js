import app from "../src/app.js";
import supertest from "supertest";
import chai from "chai";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const expect = chai.expect;
const requester = supertest.agent(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("API Integration Tests", function () {
    this.timeout(10000);

    let userToken = '';

    before(async () => {
        
        const testUserCredentials = {
            email: "avacaro@outlook.com",
            password: "coder" 
        };

        // Prueba de login
        const loginResponse = await requester
            .post('/api/sessions/login') 
            .send(testUserCredentials);

        expect(loginResponse.status).to.equal(200); 

    });

    //Pruebas para Rutas de Carritos.
    describe("Carts Routes", function () {
        this.timeout(10000);

        // Prueba 1: Crear un carrito nuevo.
        it("should create a new cart", async () => {
            const response = await requester.post("/api/carts")
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("data");
        });

        // Prueba 2: Recuperar un carrito por su ID.
        it("should retrieve a cart by ID", async () => {
            // Crear un carrito nuevo
            const cartResponse = await requester.post("/api/carts")
                .set('Authorization', `Bearer ${userToken}`);
            const cartId = cartResponse.body.data._id;

            // Recuperar el carrito por su ID
            const response = await requester.get(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("data");
            expect(response.body.data).to.have.property("_id", cartId);
        });

        // Prueba 3: Eliminar un carrito por su ID.
        it("should delete a cart", async () => {
            const cartResponse = await requester.post("/api/carts")
                .set('Authorization', `Bearer ${userToken}`);
            const cartId = cartResponse.body._id;

            const response = await requester.delete(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).to.equal(200);
        });
    });

    // Pruebas para Rutas de Productos.
    describe("Products Routes", function () {
        this.timeout(10000);

        const generateUniqueCode = () => `SP${Date.now()}`;

        // Prueba 1: Crear un producto nuevo.
        it("should create a new product", async () => {
            const productMock = {
                title: "Sample Product",
                description: "Sample Description",
                price: 100,
                code: generateUniqueCode(),
                stock: 10,
                category: "Higiene"
            };

            const createResponse = await requester.post("/api/products")
                .send(productMock)
                .catch(err => console.error(err.response.body));

            expect(createResponse.status).to.equal(200);
            expect(createResponse.body).to.have.property("message", "Product added successfully");
        });

        // Prueba 2: Recuperar un producto por su ID.
        const hardcodedProductId = "64dadcdd097f2828ab742b69";
        it("should retrieve a product by ID", async () => {
            const response = await requester.get(`/api/products/${hardcodedProductId}`)
                .catch(err => console.error(err.response.body));

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("_id", hardcodedProductId);
        });


        // Función para generar un precio aleatorio.
        const generateRandomPrice = () => Math.floor(Math.random() * 500) + 10;

        // Prueba 3: Actualizar el precio de un producto.
        it("should update the price of a product", async () => {
            // Crea un agente de supertest para simular la sesión de un usuario específico
            const requesterForUpdate = supertest.agent(app);

            // Credenciales de usuario para la sesión de prueba
            const userCredentialsForUpdate = {
                email: "avacaro@coder.com",
                password: "coder"
            };

            // Inicia sesión con el usuario específico
            const loginResponse = await requesterForUpdate
                .post('/api/sessions/login')
                .send(userCredentialsForUpdate);

            expect(loginResponse.status).to.equal(200);

            const hardcodedProductId = "64dadcdd097f2828ab742b69"; 
            const newPrice = generateRandomPrice(); 

            // Actualiza el precio del producto
            const updateResponse = await requesterForUpdate
                .put(`/api/products/${hardcodedProductId}`)
                .send({ price: newPrice });

            expect(updateResponse.status).to.equal(200); 

            // Actualiza el precio del producto
            const response = await requesterForUpdate.get(`/api/products/${hardcodedProductId}`);
            expect(response.body).to.have.property("price", newPrice); 
        });

        // Pruebas para las rutas de sesiones.
        describe("Sessions Routes", function () {
            this.timeout(10000);

            const testUserCredentials = {
                email: "avacaro@outlook.com",
                password: "coder"
            };

            // Prueba 1: Iniciar sesión.
            it("should log in a user", async () => {
                const response = await requester.post("/api/sessions/login").send(testUserCredentials);
                expect(response.status).to.equal(200);
                // Comprueba que la respuesta incluya una cookie de sesión
                expect(response.headers).to.have.property("set-cookie");
            });

            // Prueba 2: Cerrar sesión.
            it("should log out a user", async () => {

                // Cierra la sesión del usuario
                const response = await requester.get("/api/sessions/logout");
                const redirectUrl = response.headers['location'];
                expect(response.status).to.equal(302);
                expect(redirectUrl).to.equal("/");
            });

            // Prueba 3: Iniciar sesión con credenciales inválidas.
            it("should not log in with invalid credentials", async () => {
                const invalidCredentials = {
                    email: "wrong@example.com",
                    password: "incorrect"
                };
                const response = await requester.post("/api/sessions/login").send(invalidCredentials);
                expect(response.status).to.equal(302);
            });
        });

    });
});
