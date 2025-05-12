const express = require('express');
const serverless = require('serverless-http');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

// MongoDB Setup
const client = new MongoClient(process.env.MONGO_URI);
let db, collection;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('passop');
    collection = db.collection('passwords');
  }
}
connectDB();

// Routes
app.get('/api/passwords', async (req, res) => {
  try {
    await connectDB();
    const passwords = await collection.find({}).toArray();
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching passwords' });
  }
});

app.post('/api/passwords', async (req, res) => {
  try {
    await connectDB();
    const password = req.body;
    const result = await collection.insertOne(password);
    res.status(201).json({ ...password, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Error saving password' });
  }
});

app.put('/api/passwords/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    const updated = await collection.findOne({ _id: new ObjectId(id) });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating password' });
  }
});

app.delete('/api/passwords/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting password' });
  }
});

// Export as serverless handler
module.exports = app;
module.exports.handler = serverless(app);
