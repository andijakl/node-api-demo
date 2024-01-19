import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


// Simple JSON object acting as a database
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

// Configure port and create the server
const port = process.env.PORT || 3000;
const app = express();

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Configure app
// ------------------------------------------
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
 *     summary: Print hello world message
 *     responses:
 *       200:
 *         description: Hello World message
 */
app.get('/', (req, res) => {
    res.send('Hello World!');
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
    res.send(healthData.users);
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
 *            schema:
 *              $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = healthData.users.find((u) => u.id === userId);
    if (!user) res.status(404).json({ error: 'User not found' });
    res.status(200).send(user);
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
    const newUser = req.body;
    healthData.users.push(newUser);
    res.status(201).send(newUser);
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
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = healthData.users.find((u) => u.id === userId);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
    } else {
        const updatedUser = req.body;
        Object.assign(user, updatedUser);
        res.send(user);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});