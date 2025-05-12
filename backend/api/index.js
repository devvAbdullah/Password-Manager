const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://glittering-lollipop-250a38.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

// MongoDB Config
const uri = process.env.MONGO_URI;
const dbName = 'passop';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && cachedClient) {
    return { db: cachedDb, client: cachedClient };
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  console.log('Connected to MongoDB');
  return { db, client };
}

// Define routes inside the connect wrapper
app.use(async (req, res, next) => {
  try {
    const { db } = await connectToDatabase();
    req.db = db;
    req.collection = db.collection('passwords');
    next();
  } catch (error) {
    console.error('Mongo connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/api/passwords', async (req, res) => {
  try {
    const passwords = await req.collection.find({}).toArray();
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passwords' });
  }
});

app.post('/api/passwords', async (req, res) => {
  try {
    const password = req.body;
    if (!password.site || !password.username || !password.password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await req.collection.insertOne(password);
    res.status(201).json({ ...password, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save password' });
  }
});

app.delete('/api/passwords/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await req.collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Password not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete password' });
  }
});

app.put('/api/passwords/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const password = req.body;
    const result = await req.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: password }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Password not found' });
    }
    const updatedDoc = await req.collection.findOne({ _id: new ObjectId(id) });
    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Export for Vercel
module.exports = serverless(app);
