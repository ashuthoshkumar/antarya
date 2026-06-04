const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { phone, pin } = req.body;
  // Demo login: any phone + pin "1234"
  if (pin !== '1234') return res.status(400).json({ error: 'Wrong PIN' });
  
  const token = jwt.sign({ phone, shopName: 'Kirana Store' }, process.env.JWT_SECRET);
  res.json({ token, user: { phone, shopName: 'Kirana Store', owner: 'Ramesh Bhai' } });
});

module.exports = router;