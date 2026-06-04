module.exports = (memoryDB, useMongo) => {
  const router = require('express').Router();
  
  router.get('/', (req, res) => res.json(memoryDB.udhaar));
  
  router.post('/', (req, res) => {
    const entry = { ...req.body, id: Date.now(), date: new Date(), status: 'pending' };
    memoryDB.udhaar.push(entry);
    res.json(entry);
  });
  
  router.put('/:id/pay', (req, res) => {
    const idx = memoryDB.udhaar.findIndex(u => u.id == req.params.id);
    if (idx >= 0) {
      memoryDB.udhaar[idx].status = 'paid';
      memoryDB.udhaar[idx].paidDate = new Date();
    }
    res.json(memoryDB.udhaar[idx]);
  });
  
  return router;
};