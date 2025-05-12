const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5174', // Remove trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

// Database Connection
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = 'passop';

let db, collection;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    collection = db.collection('passwords');
    console.log('Connected to MongoDB');

    // Define routes only after DB connection
    defineRoutes();

    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

// Routes defined after DB connection
function defineRoutes() {

  // Get all passwords
  app.get('/api/passwords', async (req, res) => {
    try {
      const passwords = await collection.find({}).toArray();
      res.json(passwords);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch passwords' });
    }
  });

  // Save a password
  app.post('/api/passwords', async (req, res) => {
    try {
      const password = req.body;
      if (!password.site || !password.username || !password.password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const result = await collection.insertOne(password);
      res.status(201).json({ ...password, _id: result.insertedId });
    } catch (err) {
      console.error('Error saving password:', err);
      res.status(500).json({ error: 'Failed to save password' });
    }
  });

  // Delete a password by id
  app.delete('/api/passwords/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Password not found' });
      }
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete password' });
    }
  });

  // Update a password
  app.put('/api/passwords/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const password = req.body;
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: password }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Password not found' });
      }
      const updatedDoc = await collection.findOne({ _id: new ObjectId(id) });
      res.json(updatedDoc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update password' });
    }
  });
}

// Connect to DB and run server
connectDB();
