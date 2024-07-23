const express = require('express');
const app = express();
const router = require('./routes/route.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const port = process.env.PORT 

// Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));

// Regular routes
app.use(router);
console.log('Routes added:');

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  }
});

// Error handling middleware for body parsing
app.use((err, req, res, next) => {
  if (err) {
    console.error('Body Parser Error:', err.message);
    res.status(400).json({ error: 'Invalid request body format' });
  } else {
    next();
  }
});

// Error handling middleware for CORS
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // Handle CSRF token errors
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  if (err.name === 'UnauthorizedError') {
    // Handle unauthorized errors
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err) {
    // Handle other errors
    console.error('Error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
  next();
});

// Database connection
mongoose.connect(process.env.DATABASE_URI).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  console.log('Database connection successful');
}).catch(error => {
  console.log(error.message);
});
