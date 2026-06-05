const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));

const memoryDB = {
  inventory: [],
  sales: [],
  customers: [],
  udhaar: [],
  expenses: []
};

// Make memoryDB available to all routes
app.locals.memoryDB = memoryDB;

const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'antarya_secret_2026');
    next();
  } catch { 
    res.status(403).json({ error: 'Invalid token' }); 
  }
};

app.use('/api/auth', require('./routes/auth'));

app.get('/api/inventory', auth, (req, res) => res.json(memoryDB.inventory));
app.post('/api/inventory', auth, (req, res) => {
  const item = { ...req.body, id: Date.now(), createdAt: new Date() };
  memoryDB.inventory.push(item);
  res.json(item);
});

app.get('/api/sales', auth, (req, res) => res.json(memoryDB.sales));
app.post('/api/sales', auth, (req, res) => {
  const sale = { ...req.body, id: Date.now(), date: new Date() };
  memoryDB.sales.push(sale);
  sale.items?.forEach(soldItem => {
    const inv = memoryDB.inventory.find(i => i.name === soldItem.name);
    if (inv) inv.quantity -= soldItem.qty;
  });
  res.json(sale);
});

app.get('/api/customers', auth, (req, res) => res.json(memoryDB.customers));
app.post('/api/customers', auth, (req, res) => {
  const customer = { ...req.body, id: Date.now(), lastVisit: new Date() };
  memoryDB.customers.push(customer);
  res.json(customer);
});

app.get('/api/udhaar', auth, (req, res) => res.json(memoryDB.udhaar));
app.post('/api/udhaar', auth, (req, res) => {
  const entry = { ...req.body, id: Date.now(), date: new Date(), status: 'pending' };
  memoryDB.udhaar.push(entry);
  res.json(entry);
});
app.put('/api/udhaar/:id/pay', auth, (req, res) => {
  const idx = memoryDB.udhaar.findIndex(u => u.id == req.params.id);
  if (idx >= 0) {
    memoryDB.udhaar[idx].status = 'paid';
    memoryDB.udhaar[idx].paidDate = new Date();
  }
  res.json(memoryDB.udhaar[idx]);
});

// AI Advisor route - uses smart fallback
app.use('/api/advisor', auth, require('./routes/advisor')(memoryDB));

app.get('/health', (req, res) => res.json({ status: 'ok', db: 'memory' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});