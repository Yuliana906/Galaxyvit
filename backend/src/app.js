const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const rutas = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: env.frontendUrl })); // permite el frontend (Vite)
app.use(express.json());                    // parsea JSON del cuerpo
app.use('/api', rutas);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
