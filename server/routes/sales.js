module.exports = (memoryDB, useMongo) => {
  const router = require('express').Router();
  
  router.get('/', (req, res) => res.json(memoryDB.sales));
  
  router.post('/', (req, res) => {
    const sale = { ...req.body, id: Date.now(), date: new Date() };
    memoryDB.sales.push(sale);
    
    // Auto-update inventory
    sale.items.forEach(soldItem => {
      const inv = memoryDB.inventory.find(i => i.name === soldItem.name);
      if (inv) inv.quantity -= soldItem.qty;
    });
    
    res.json(sale);
  });
  
  return router;
};