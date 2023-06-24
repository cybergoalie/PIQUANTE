const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

/**  
 * Middleware for handling requests to '/api/stuff' endpoint.
 * Returns a list of dummy data for demonstration purposes.
*/
app.post('/api/stuff', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Thing created successfully!'
  });
});

app.use('/api/stuff', (req, res, next) => {
  const stuff = [
    {
      _id: 'oeihfzeoi',
      title: 'My first thing',
      description: 'All of the info about my first thing',
      imageUrl: '',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'My second thing',
      description: 'All of the info about my second thing',
      imageUrl: '',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(stuff);
});

/** 
 * Middleware for handling CORS
 * Adds necessary headers to allow requests from different origins.
*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Serve static files from the `images` directory:
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes

// const userRoutes = require('./routes/userRoutes');
// const saucesRoutes = require('./routes/saucesRoutes');
// app.use('/api/auth', userRoutes);
// app.use('/api/sauces', saucesRoutes);

// Catch undefined or invalid routes
app.use((req, res, next) => {
  res.redirect('/api/sauces'); // Redirect to the sauce list route
});

module.exports = app;