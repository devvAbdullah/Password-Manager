const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = 'passop';

let collection;

// MongoDB connection
client.connect().then(() => {
  const db = client.db(dbName);
  collection = db.collection('passwords');
  console.log('Connected to MongoDB');
}).catch(console.error);

// Test route
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Get all passwords
app.get('/api/passwords', async (req, res) => {
  const passwords = await collection.find({}).toArray();
  res.json(passwords);
});

// Add a password
app.post('/api/passwords', async (req, res) => {
  const password = req.body;
  const result = await collection.insertOne(password);
  res.status(201).json({ ...password, _id: result.insertedId });
});

// Delete a password
app.delete('/api/passwords/:id', async (req, res) => {
  const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: result.deletedCount > 0 });
});

// Update a password
app.put('/api/passwords/:id', async (req, res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  const updated = await collection.findOne({ _id: new ObjectId(req.params.id) });
  res.json(updated);
});

// Export as Vercel function
module.exports = app;
