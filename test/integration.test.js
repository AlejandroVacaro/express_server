import app from "../src/app.js"; // Ensure this imports your Express app with routes
import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const requester = supertest(app);

describe("API Integration Tests", function() {
    this.timeout(10000);

    let userToken = '';

    before(async () => {
        // Create a test user
        const testUser = {
            first_name: "Test",
            last_name: "User",
            email: "testuser@example.com",
            password: "password123"
            // Add other required fields as necessary
        };

        const createUserResponse = await requester
            .post('/api/sessions/signup')
            .send(testUser);

        // Check if the user was created successfully
        expect(createUserResponse.status).to.equal(200); // Or the expected success status code

        // Log in to get a token
        const loginResponse = await requester
            .post('/api/sessions/login')
            .send({ email: testUser.email, password: testUser.password });
        userToken = loginResponse.body.token;
    });

    // Tests for Carts Routes
    describe("Carts Routes", function () {
        this.timeout(10000);

        // Test 1: Create a new cart
        it("should create a new cart", async () => {
            const response = await requester.post("/api/carts")
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property("_id");
        });

        // Test 2: Retrieve a cart by ID
        it("should retrieve a cart by ID", async () => {
            const cartResponse = await requester.post("/api/carts")
                .set('Authorization', `Bearer ${userToken}`);
            const cartId = cartResponse.body._id;

            const response = await requester.get(`/api/carts/${cartId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("_id", cartId);
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

        // Test 1: Create a new product
        it("should create a new product", async () => {
            const productMock = { /* product details */ };
            const response = await requester.post("/api/products").send(productMock);
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property("_id");
        });

        // Test 2: Retrieve a product by ID
        it("should retrieve a product by ID", async () => {
            const productResponse = await requester.post("/api/products").send({ /* product details */ });
            const productId = productResponse.body._id;

            const response = await requester.get(`/api/products/${productId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("_id", productId);
        });

        // Test 3: Update a product
        it("should update a product", async () => {
            const productResponse = await requester.post("/api/products").send({ /* product details */ });
            const productId = productResponse.body._id;

            const response = await requester.put(`/api/products/${productId}`).send({ /* updated details */ });
            expect(response.status).to.equal(200);
        });
    });

    // Tests for Sessions Routes
    describe("Sessions Routes", function () {
        this.timeout(10000);

        // Test 1: User login
        it("should log in a user", async () => {
            const userCredentials = { /* user credentials */ };
            const response = await requester.post("/api/sessions").send(userCredentials);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("token");
        });

        // Test 2: User logout
        it("should log out a user", async () => {
            const token = 'some-auth-token'; // Replace with a valid token
            const response = await requester.delete("/api/sessions")
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).to.equal(200);
        });

        // Test 3: Invalid login attempt
        it("should not log in with invalid credentials", async () => {
            const invalidCredentials = { /* invalid credentials */ };
            const response = await requester.post("/api/sessions").send(invalidCredentials);
            expect(response.status).to.equal(401); // Assuming 401 for unauthorized
        });
    });
});
