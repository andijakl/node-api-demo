# Node API Demo

Small demo application that demonstrates the necessary components for creating an API using Node.js. This includes vital components like the Express web server, CORS configuration, the body parser plug-in and the OpenAPI / Swagger API documentation & web testing interface.

The API manages user health data, storing information like name, age, weight, and height. All data is kept in memory, so it resets when you restart the server.

## Getting Started

Install the dependencies:

```bash
npm install
```

Start the server:

```bash
node index.js
```

The API runs at `http://localhost:3000`.

### Swagger UI

Open `http://localhost:3000/api-docs` in your browser to access the **Swagger UI**. This interactive interface lets you explore all available endpoints, view request/response schemas, and test the API directly from your browser without needing additional tools.

## Related Information

Released under the MIT license - see the LICENSE file for details.

Developed by Andreas Jakl

* <https://www.andreasjakl.com/>
