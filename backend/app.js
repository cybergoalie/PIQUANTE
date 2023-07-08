const express = require('express');
const path = require('path');
const app = express();
const Thing = require('./models/thing');
app.use(express.json());

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



/**  
 * Middleware for handling requests to '/api/stuff' endpoint.
 * Returns a list of dummy data for demonstration purposes.
*/

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

// Serve static files from the `images` directory:
app.use('/images', express.static(path.join(__dirname, 'images')));

app.post('/api/stuff', (req, res, next) => {
  console.log(req.body); // Log the request body to the console
  const { title, description, imageUrl, price, userId } = req.body;
  const thing = new Thing({
    title,
    description,
    imageUrl,
    price,
    userId
  });
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'Thing saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  )
});

// Route to get a specific thing

app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({_id: req.params.id})
    .then((thing) => {
      if (!thing) {
        return res.status(404).json({ error: 'Thing not found' });
      }
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});


// Route to get all things
app.use('/api/stuff', (req, res, next) => {
  Thing.find().then((things) => {
    res.status(200).json(things);
  })
  .catch((error) => {
    res.status(500).json({
      error:error
    });
  });
});

// Routes
module.exports = app;