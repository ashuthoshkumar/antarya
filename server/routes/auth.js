const router = require('express').Router();
const jwt = require('jsonwebtoken');

// Demo users database (in-memory)
const users = [
  { phone: '9876543210', pin: '1234', name: 'Ramesh Bhai', shopName: 'Ramesh Kirana Store' },
  { phone: '9876543211', pin: '1234', name: 'Suresh Bhai', shopName: 'Suresh General Store' },
];

router.post('/login', async (req, res) => {
  const { phone, pin } = req.body;

  if (!phone || !pin) {
    return res.status(400).json({ error: 'Phone aur PIN dono daaliye' });
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone number galat hai' });
  }

  if (pin.length !== 4) {
    return res.status(400).json({ error: 'PIN 4 digits ka hona chahiye' });
  }

  if (pin !== '1234') {
    return res.status(400).json({ error: 'PIN galat hai. 1234 try karein.' });
  }

  const user = users.find(u => u.phone === phone) || {
    phone,
    name: 'Kirana Owner',
    shopName: 'Apni Dukan'
  };

  const token = jwt.sign(
    { phone: user.phone, name: user.name, shopName: user.shopName },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      phone: user.phone,
      name: user.name,
      shopName: user.shopName,
      owner: user.name
    }
  });
});

router.post('/register', async (req, res) => {
  const { phone, pin, name, shopName, shopAddress, shopType } = req.body;

  if (!phone || !pin || !name || !shopName) {
    return res.status(400).json({ error: 'Sab fields bhariye' });
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone number galat hai' });
  }

  if (pin.length !== 4) {
    return res.status(400).json({ error: 'PIN 4 digits ka hona chahiye' });
  }

  const existingUser = users.find(u => u.phone === phone);
  if (existingUser) {
    return res.status(400).json({ error: 'Ye phone number pehle se registered hai' });
  }

  const newUser = {
    phone,
    pin,
    name,
    shopName,
    shopAddress: shopAddress || '',
    shopType: shopType || 'kirana'
  };
  users.push(newUser);

  const token = jwt.sign(
    { phone: newUser.phone, name: newUser.name, shopName: newUser.shopName },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
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

module.exports = router;