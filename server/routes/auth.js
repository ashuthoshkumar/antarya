const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user database
const users = [];

const generateToken = (user) => {
  return jwt.sign(
    { phone: user.phone, name: user.name, shopName: user.shopName },
    process.env.JWT_SECRET || 'antarya_secret_2026',
    { expiresIn: '7d' }
  );
};

// REGISTER
router.post('/register', async (req, res) => {
  const { phone, pin, name, shopName, shopAddress, shopType } = req.body;

  if (!phone || !pin || !name || !shopName) {
    return res.status(400).json({ error: 'Sab fields bhariye' });
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Sahi 10-digit phone number daaliye' });
  }

  if (pin.length !== 4) {
    return res.status(400).json({ error: 'PIN 4 digits ka hona chahiye' });
  }

  const existingUser = users.find(u => u.phone === phone);
  if (existingUser) {
    return res.status(400).json({ error: 'Ye phone number pehle se registered hai. Login karein.' });
  }

  const hashedPin = await bcrypt.hash(pin, 10);

  const newUser = {
    phone,
    pin: hashedPin,
    name,
    shopName,
    shopAddress: shopAddress || '',
    shopType: shopType || 'kirana',
    createdAt: new Date()
  };
  users.push(newUser);

  const token = generateToken(newUser);

  res.status(201).json({
    message: 'Account ban gaya!',
    token,
    user: {
      phone: newUser.phone,
      name: newUser.name,
      shopName: newUser.shopName,
      owner: newUser.name,
      shopAddress: newUser.shopAddress,
      shopType: newUser.shopType
    }
  });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { phone, pin } = req.body;

  if (!phone || !pin) {
    return res.status(400).json({ error: 'Phone aur PIN dono daaliye' });
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Sahi phone number daaliye' });
  }

  const user = users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ error: 'Account nahi mila. Pehle register karein.' });
  }

  const isValidPin = await bcrypt.compare(pin, user.pin);
  if (!isValidPin) {
    return res.status(401).json({ error: 'PIN galat hai' });
  }

  const token = generateToken(user);

  res.json({
    message: 'Login successful!',
    token,
    user: {
      phone: user.phone,
      name: user.name,
      shopName: user.shopName,
      owner: user.name,
      shopAddress: user.shopAddress,
      shopType: user.shopType
    }
  });
});

module.exports = router;