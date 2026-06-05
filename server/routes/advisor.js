module.exports = (memoryDB) => {
  const router = require('express').Router();

  router.post('/ask', async (req, res) => {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question daaliye' });
    }

    const q = question.toLowerCase();

    // Get real data
    const inventory = memoryDB?.inventory || [];
    const sales = memoryDB?.sales || [];
    const udhaar = memoryDB?.udhaar || [];
    const customers = memoryDB?.customers || [];

    // ===== UDHAR (check FIRST before stock) =====
    if (q.includes('udhaar') || q.includes('paisa') || q.includes('baaki') || q.includes('dena')) {
      const pending = udhaar.filter(u => u.status === 'pending');
      if (pending.length === 0) {
        return res.json({ answer: '🎉 Koi udhaar nahi hai! Sab paise aa gaye.' });
      }
      const total = pending.reduce((s, u) => s + (u.amount || 0), 0);
      let answer = `💰 ${pending.length} logon se ₹${total} udhaar baaki hai:\n`;
      pending.forEach((u, i) => {
        answer += `${i+1}. ${u.customer}: ₹${u.amount}\n`;
      });
      return res.json({ answer });
    }

    // ===== PROFIT / SALES =====
    if (q.includes('profit') || q.includes('fayda') || q.includes('sales') || q.includes('kamai') || q.includes('aaj')) {
      const totalSales = sales.reduce((s, sale) => s + (sale.total || 0), 0);
      const today = new Date().toDateString();
      const todaySales = sales.filter(s => new Date(s.date).toDateString() === today);
      const todayTotal = todaySales.reduce((s, sale) => s + (sale.total || 0), 0);
      const profit = Math.round(todayTotal * 0.15);
      
      if (todayTotal > 0) {
        return res.json({ answer: `📊 Aaj ki sales: ₹${todayTotal}\n💰 Profit: ₹${profit}\n📈 Total: ₹${totalSales}` });
      }
      return res.json({ answer: `📊 Aaj koi sale nahi. Total: ₹${totalSales}\n💡 Discount do customers ko.` });
    }

    // ===== STOCK / INVENTORY (check LAST) =====
    if (q.includes('stock') || q.includes('samaan') || q.includes('inventory') || q.includes('kitna') || q.includes('khatam') || q.includes('hai')) {
      const lowStock = inventory.filter(i => i.quantity < 10);
      const outOfStock = inventory.filter(i => i.quantity === 0);
      
      if (outOfStock.length > 0) {
        return res.json({ answer: `⚠️ ${outOfStock.map(i => i.name).join(', ')} bilkul khatam! Supplier ko call karo.` });
      }
      if (lowStock.length > 0) {
        return res.json({ answer: `📦 ${lowStock.map(i => `${i.name} (${i.quantity} left)`).join(', ')} kam hai. Jaldi mangwao!` });
      }
      return res.json({ answer: `✅ Sab stock theek hai. ${inventory.length} items available.` });
    }

    // ===== CUSTOMERS =====
    if (q.includes('customer') || q.includes('log')) {
      return res.json({ answer: `👥 ${customers.length} registered customers hain.` });
    }

    // ===== DEFAULT =====
    return res.json({ answer: `🤔 Main samjha nahi. Poochho:\n• "Kitna udhaar baaki hai?"\n• "Mera stock kaisa hai?"\n• "Aaj kitna profit hua?"` });
  });

  return router;
};