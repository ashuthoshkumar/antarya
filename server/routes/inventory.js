module.exports = (memoryDB, useMongo) => {
  const router = require('express').Router();
  
  router.get('/', (req, res) => {
    res.json(memoryDB.inventory);
  });
  
  router.post('/', (req, res) => {
    const item = { ...req.body, id: Date.now(), createdAt: new Date() };
    memoryDB.inventory.push(item);
    res.json(item);
  });
  
  router.put('/:id', (req, res) => {
    const idx = memoryDB.inventory.findIndex(i => i.id == req.params.id);
    if (idx >= 0) memoryDB.inventory[idx] = { ...memoryDB.inventory[idx], ...req.body };
    res.json(memoryDB.inventory[idx]);
  });
  
  return router;
};