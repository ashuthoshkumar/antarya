import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Mic, Bot, User, Loader } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export default function Advisor() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste Bhai! Main ANTARYA hoon. Aapko kya jaanna hai? Stock, udhaar, ya profit ke baare mein?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await api.post('/advisor/ask', { question: userMsg });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Thodi dikkat ho gayi. Dobara try karo.' }]);
    }
    setLoading(false);
  };
  
  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice support nahi hai. Chrome use karo.');
      return;
    }
    
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };
  
  const quickQuestions = [
    'Mera stock kaisa hai?',
    'Kitna udhaar baaki hai?',
    'Aaj kitna profit hua?',
    'Kaunsa samaan khatam hone wala hai?'
  ];
  
  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <h1 className="text-2xl font-bold mb-4">AI Advisor</h1>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-auto p-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 mb-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'bot' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
              {m.role === 'bot' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className={`max-w-[70%] p-3 rounded-lg ${m.role === 'bot' ? 'bg-gray-100' : 'bg-blue-600 text-white'}`}>
              <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot size={18} className="text-blue-700" />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <Loader size={18} className="animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      
      <div className="flex gap-2 mb-3 flex-wrap">
        {quickQuestions.map((q, i) => (
          <button key={i} onClick={() => { setInput(q); }}
            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100">
            {q}
          </button>
        ))}
      </div>
      
      <div className="flex gap-2">
        <button onClick={startVoice} className={`p-3 rounded-lg ${listening ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
          <Mic size={20} />
        </button>
        <input className="flex-1 p-3 border rounded-lg" placeholder="Hinglish mein poochho..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()} />
        <button onClick={sendMessage} className="bg-blue-600 text-white p-3 rounded-lg">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}