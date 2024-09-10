const express = require('express');
const cors = require('cors');

const indexRoute = require('./routes/index');

//ENV
require('dotenv').config();

const app = express();

//MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//ROUTES
app.use('/', indexRoute);

// PORT CONNECT
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => console.log(`server running on port ${port}`)); 