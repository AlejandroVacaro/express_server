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
        // Hardcoded user credentials
        const testUserCredentials = {
            email: "avacaro@outlook.com", // Replace with your hardcoded user's email
            password: "coder" // Replace with your hardcoded user's password
        };

        // Log in to get the authentication cookie
        const loginResponse = await requester
            .post('/api/sessions/login') // Ensure this is the correct login endpoint
            .send(testUserCredentials);

        expect(loginResponse.status).to.equal(200); // Or the status code your login endpoint returns on success

    });

    // Tests for Carts Routes
    describe("Carts Routes", function () {
        this.timeout(10000);

        // Test 1: Create a new cart
        it("should create a new cart", async () => {
            const response = await requester.post("/api/carts")
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).to.equal(200);
            console.log(response.body);
            expect(response.body).to.have.property("data");
        });

        // Test 2: Retrieve a cart by ID
        it("should retrieve a cart by ID", async () => {
            // Create a cart first
            const cartResponse = await requester.post("/api/carts")
                .set('Authorization', `Bearer ${userToken}`);
            const cartId = cartResponse.body.data._id; // Capture the cart ID

            // Retrieve the created cart
            const response = await requester.get(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("data");
            expect(response.body.data).to.have.property("_id", cartId);
        });

        // Test 3: Delete a cart
        it("should delete a cart", async () => {
            const cartResponse = await requester.post("/api/carts")
                .set('Authorization', `Bearer ${userToken}`);
            const cartId = cartResponse.body._id;

            const response = await requester.delete(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).to.equal(200);
        });
    });

    // Tests for Products Routes
    describe("Products Routes", function () {
        this.timeout(10000);

        const generateUniqueCode = () => `SP${Date.now()}`;

        // Test 1: Create a new product
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

        // Test 2: Retrieve a product by ID
        // Hardcoded _id of the product you want to test
        const hardcodedProductId = "64dadcdd097f2828ab742b69";
        it("should retrieve a product by ID", async () => {
            const response = await requester.get(`/api/products/${hardcodedProductId}`)
                .catch(err => console.error(err.response.body));

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("_id", hardcodedProductId);
        });


        // Test 3: Update a product
        it("should update a product", async () => {
            // Create a new instance of requester that will retain cookies
            const requesterForUpdate = supertest.agent(app);
    
            // User credentials for a user with permissions to update the product
            const userCredentialsForUpdate = {
                email: "avacaro@coder.com",
                password: "coder"
            };
    
            // Log in as the specific user for this test
            const loginResponse = await requesterForUpdate
                .post('/api/sessions/login')
                .send(userCredentialsForUpdate);
    
            expect(loginResponse.status).to.equal(200);
    
            const hardcodedProductId = "64dadcdd097f2828ab742b69"; // Hardcoded product ID
            const updatedProductDetails = {
                title: "Updated Product",
                description: "Updated Description",
                price: 150,
                // other fields to update
            };
    
            // Update the product using the specific user's session
            const updateResponse = await requesterForUpdate
                .put(`/api/products/${hardcodedProductId}`)
                .send(updatedProductDetails);
    
            expect(updateResponse.status).to.equal(200); // Assuming 200 for successful update
    
            // Optionally, retrieve the product again to verify updates
            const response = await requesterForUpdate.get(`/api/products/${hardcodedProductId}`);
            expect(response.body).to.include(updatedProductDetails); // Validate the response includes updated product details
        });

        // Tests for Sessions Routes
        describe("Sessions Routes", function () {
            this.timeout(10000);

            // Assuming you have a hardcoded user for testing
            const testUserCredentials = {
                email: "avacaro@outlook.com", // Replace with your test user's email
                password: "coder" // Replace with your test user's password
            };

            // Test 1: User login
            it("should log in a user", async () => {
                const response = await requester.post("/api/sessions/login").send(testUserCredentials);
                expect(response.status).to.equal(200);
                // Check for set-cookie header if your login response sets a cookie
                expect(response.headers).to.have.property("set-cookie");
            });

            // Test 2: User logout
            it("should log out a user", async () => {
                // // First, log in to establish a session
                // await requester.post("/api/sessions/login").send(testUserCredentials);

                // Then, attempt to log out
                const response = await requester.get("/api/sessions/logout");
                const redirectUrl = response.headers['location'];
                expect(response.status).to.equal(302);
                expect(redirectUrl).to.equal("/");
            });

            // Test 3: Invalid login attempt
            it("should not log in with invalid credentials", async () => {
                const invalidCredentials = {
                    email: "wrong@example.com",
                    password: "incorrect"
                };
                const response = await requester.post("/api/sessions/login").send(invalidCredentials);
                console.log(response.body);
                expect(response.status).to.equal(302);
            });
        });

    });
});
