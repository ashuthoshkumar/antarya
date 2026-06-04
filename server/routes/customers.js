module.exports = (memoryDB, useMongo) => {
  const router = require('express').Router();
  
  router.get('/', (req, res) => res.json(memoryDB.customers));
  
  router.post('/', (req, res) => {
    const customer = { ...req.body, id: Date.now(), lastVisit: new Date() };
    memoryDB.customers.push(customer);
    res.json(customer);
  });
  
  return router;
};