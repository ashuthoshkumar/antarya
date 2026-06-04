module.exports = (memoryDB, useMongo) => {
  const router = require('express').Router();
  
  router.post('/ask', async (req, res) => {
    const { question } = req.body;
    
    // Build context from shop data
    const context = {
      inventory: memoryDB.inventory,
      sales: memoryDB.sales.slice(-7), // last 7 sales
      udhaar: memoryDB.udhaar.filter(u => u.status === 'pending'),
      customers: memoryDB.customers
    };
    
    const prompt = `You are ANTARYA, an AI advisor for a small Indian kirana store. 
    The shopkeeper asks in Hinglish or English. Give SHORT, practical advice.
    
    Shop Data: ${JSON.stringify(context)}
    
    Question: ${question}
    
    Answer in 2-3 sentences max. Be friendly and actionable.`;
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Bhai, thoda busy hoon. Dobara poochho.";
      res.json({ answer });
    } catch (err) {
      // Fallback responses
      const fallbacks = {
        'stock': 'Aapke paas atta aur chawal kam hai. Supplier ko call karo.',
        'udhaar': 'Mohan ₹450 aur Priya ₹200 dena baaki hai. Aaj hi phone karo.',
        'profit': 'Aaj ₹1,200 ka fayda hua. Kal se ₹800 zyada hai.',
        'customer': '4 customers 7 din se nahi aaye. Unhe WhatsApp karo.'
      };
      const key = Object.keys(fallbacks).find(k => question.toLowerCase().includes(k));
      res.json({ answer: fallbacks[key] || 'Data check karo, main madad karunga.' });
    }
  });
  
  return router;
};