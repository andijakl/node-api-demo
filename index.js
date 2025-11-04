/**
 * This example implements a simple health data server using Node.js and Express.
 * The server provides RESTful API endpoints for managing user health data.
 * It uses Swagger for API documentation and validation.
 * The server is configured to run on port 3000 by default, but can be configured using the PORT environment variable.
 * The health data is stored in memory as a simple JSON object acting as a database.
 * 
 * The API endpoints include:
 * - GET /: Returns a hello world message to test the server.
 * - GET /users: Returns a list of registered users.
 * - GET /users/{id}: Returns a specific user by ID.
 * - POST /users: Creates a new user.
 * - PUT /users/{id}: Updates a user by ID.
 * 
 * When running the demo, you can access the API documentation at http://localhost:3000/api-docs.
 * 
 * @see {@link https://swagger.io/|Swagger}
 * @see {@link https://expressjs.com/|Express}
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


// Simple JSON object acting as a database
// ------------------------------------------
/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *         weight:
 *           type: integer
 *         height:
 *           type: integer
 *       example:
 *         id: 1
 *         name: John Doe
 *         age: 30
 *         weight: 75
 *         height: 180
 */
const healthData = {
    users: [
        {
            id: 1,
            name: 'John Doe',
            age: 30,
            weight: 75,
            height: 180,
        },
    ],
};

// Also define the error schema for consistency
/**
 * @openapi
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: 'User name cannot be changed'
 */

// Configure port and create the server
const port = process.env.PORT || 3000;
const app = express();

// Configure app
// ------------------------------------------

// Options for the swagger docs
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Simple Health Data Server',
            version: '1.0.0',
        },
    },
    apis: ['*.js'], // files containing annotations as above
};
const specs = swaggerJsdoc(options);
// API documentation route, available at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Parse requests of content-type - application/json
app.use(bodyParser.json());
// Enable CORS for all requests originating from localhost
app.use(cors({ origin: 'http://localhost/' }));

// API routes
// ------------------------------------------

/**
 * @openapi
 * /:
 *   get:
 *     summary: Print hello world message.
 *     description: Simple API to test the API doc and correct execution.
 *     responses:
 *       200:
 *         description: Hello World message
 */
app.get('/', (req, res) => {
    return res.send('Visit the API docs at <a href="/api-docs/">api-docs</a>.');
});

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get list of registered users
 *     responses:
 *       200:
 *         description: JSON formatted list of users
 */
app.get('/users', (req, res) => {
    // Send the whole list of users
    return res.send(healthData.users);
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/users/:id', (req, res) => {
    // Get the user ID from the URL path
    // e.g., /users/1 -> userId = 1
    const userId = parseInt(req.params.id);
    // Find the user in the database by ID
    // e.g., healthData.users[0] -> { id: 1, name: 'John Doe', ... }
    const user = healthData.users.find((u) => u.id === userId);
    // Send 404 error if user not found
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Send user object if found, with status 200 (OK)
    return res.status(200).send(user);
});

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
app.post('/users', (req, res) => {
    // Get the new user data from the request body
    const newUser = req.body;
    // TODO: Validate the new user data and automatically assign an ID
    // Add the new user to the database
    healthData.users.push(newUser);
    // Send the new user object back with status 201 (Created)
    return res.status(201).send(newUser);
});

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid updated user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put('/users/:id', (req, res) => {
    // Get the user ID from the URL path
    const userId = parseInt(req.params.id);
    // Find the user in the database by ID
    const user = healthData.users.find((u) => u.id === userId);
    if (!user) {
        // Send 404 error if user not found
        return res.status(404).json({ error: 'User not found' });
    } else {
        // Update the user object with new data from the request body
        const updatedUser = req.body;
        // TODO: Validate the updated user data
        // Prevent changing the user name
        if (updatedUser.name && updatedUser.name !== user.name) {
            // Send 400 error if user name is changed (400 = Bad Request)
            return res.status(400).json({ error: 'User name cannot be changed' });
        }
        // Assign the updated user data to the original user object
        Object.assign(user, updatedUser);
        // Send the updated user object back with status 200 (OK)
        return res.status(200).send(user);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});