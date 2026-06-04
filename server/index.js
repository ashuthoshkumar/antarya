const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// In-Memory Fallback DB
const memoryDB = {
  inventory: [],
  sales: [],
  customers: [],
  udhaar: [],
  expenses: []
};

// MongoDB Connection with Fallback
const mongoose = require('mongoose');
let useMongo = false;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => { useMongo = true; console.log('MongoDB Connected'); })
  .catch(() => { console.log('Using In-Memory DB'); });

// Middleware
const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(403).json({ error: 'Invalid token' }); }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', auth, require('./routes/inventory')(memoryDB, useMongo));
app.use('/api/sales', auth, require('./routes/sales')(memoryDB, useMongo));
app.use('/api/customers', auth, require('./routes/customers')(memoryDB, useMongo));
app.use('/api/udhaar', auth, require('./routes/udhaar')(memoryDB, useMongo));
app.use('/api/advisor', auth, require('./routes/advisor')(memoryDB, useMongo));

app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  db: useMongo ? 'mongodb' : 'memory' 
}));

app.listen(process.env.PORT, () => 
  console.log(`Server running on port ${process.env.PORT}`)
);