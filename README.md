🏪 ANTARYA — The Ultimate AI-Powered Ecosystem for the Modern Kirana Store
"Apki Dukan Ka Digital Dimaag" — Your Shop's Digital Brain
📋 Table of Contents
Problem Statement
Our Solution
Key Features
System Architecture
Tech Stack
Screenshots
Installation & Setup
API Endpoints
Future Scope
Impact
Contributors
🎯 Problem Statement
"The ₹30 Lakh Crore Blind Spot"
India has 12 million+ kirana stores that still operate on pen and paper. This creates massive inefficiencies:
Table
Problem	Impact
40% Inventory Waste	Poor tracking leads to overstocking or stockouts
60% Unrecovered Credit (Udhaar)	No proper record-keeping; shopkeepers forget who owes what
Manual Billing	Slow checkout, calculation errors, no sales analytics
No Digital Tools	Existing software is too complex and not designed for local shopkeepers
Language Barrier	Most apps are English-only; shopkeepers prefer Hinglish/Hindi
Result: Lost revenue, unpaid debts, overstocking, and running out of essential items.
💡 Our Solution
ANTARYA is an AI-powered platform that acts like a digital brain for the shop. It doesn't just store data — it understands it and gives meaningful, actionable insights.
Design Philosophy
Simple & Natural: Conversational Hinglish support. Shopkeepers talk to it like they talk to a friend.
Zero Complexity: Hide complex technology behind a friendly interface anyone can use.
Always Works: Offline fallback ensures the app never crashes, even without internet.
✨ Key Features
1. 🔐 Smart Authentication
Phone number + 4-digit PIN login
"Remember Me" for quick access
JWT-based secure sessions
Register new store with 2-step onboarding
2. 📊 Smart Dashboard
Real-time overview of:
Today's Sales
Pending Udhaar (Credit)
Low Stock Alerts
Estimated Profit
One-click demo data loading for quick testing
Visual alerts for items running low
3. 🛒 Smart POS (Point of Sale)
One-click product selection
Auto quantity management (+ / - / remove)
Multiple payment modes: Cash, UPI, Udhaar
Automatic inventory deduction on sale
Bill preview & print-ready receipt
Customer name tagging for credit sales
4. 📦 Inventory Management
Add / view all stock items
Category-wise organization (Grocery, Dairy, Snacks, Personal Care)
Low Stock Alert — automatic highlighting when quantity < 10
Real-time stock updates after every sale
5. 💰 Udhaar (Credit) Management
Track who owes money and how much
Item-wise credit history
One-click "Paaida Karo" (Mark as Paid)
Total pending amount display
No more forgotten debts
6. 🤖 AI Advisory System
Acts like a team of experts:
Financial Advisor: Analyzes income, expenses, pending credit
Marketing Advisor: Identifies customers who haven't visited recently
Operations Advisor: Monitors stock levels and slow-moving items
Voice Input: Speak in Hindi/Hinglish, get answers in Hinglish
Powered by Google Gemini 2.5 Flash API
Fallback responses if AI service is unavailable
7. 🌐 Resiliency & Reliability
Table
Scenario	Fallback
Internet unstable	In-memory DB auto-activates
MongoDB unreachable	Local memory database mounts
AI API quota exceeded	Pre-written smart fallback responses
Server down	Frontend continues with cached data
The app never crashes. It always remains usable.
🏗️ System Architecture
plain
┌─────────────────────────────────┐
│      Client UI (React + Vite)   │
│  ┌─────────┐ ┌─────────┐      │
│  │  User   │ │ Voice   │      │
│  │Interface│ │ Input   │      │
│  └────┬────┘ └────┬────┘      │
│       │ REST API   │ Audio     │
│       │ (JSON)     │ Base64    │
└───────┼────────────┼───────────┘
        │            │
        ▼            ▼
┌─────────────────────────────────┐
│    Server API (Node + Express)  │
│  ┌─────────────────────────┐    │
│  │ Express Router → JWT    │    │
│  │ Middleware → AI Fallback│    │
│  │ Controller → Database   │    │
│  │ Controller              │    │
│  └─────────────────────────┘    │
└───────┬─────────────────┬───────┘
        │                 │
   ┌────┴────┐       ┌────┴────┐
   │External │       │  Data   │
   │ Cloud   │       │Persistence
   │Services │       │         │
   ├─────────┤       ├─────────┤
   │Bhashini │       │MongoDB  │
   │ASR/Trans│       │Atlas    │
   ├─────────┤       │(Primary)│
   │Google   │       ├─────────┤
   │Gemini   │       │In-Memory│
   │2.5 Flash│       │DB       │
   │API      │       │(Fallback)
   └─────────┘       └─────────┘
🛠️ Tech Stack
Table
Layer	Technology
Frontend	React 18 + Vite + Tailwind CSS v3 + Lucide React Icons
Backend	Node.js + Express.js
Database	MongoDB Atlas (Primary) + In-Memory DB (Fallback)
AI/ML	Google Gemini 2.5 Flash API
Voice	Web Speech API (Browser) + Bhashini ASR (Future)
Auth	JWT (JSON Web Tokens)
State	React Hooks + LocalStorage
📸 Screenshots
Table
Page	Description
Login	Glass-morphism UI with background image, phone validation, PIN toggle
Register	2-step onboarding: Personal Details → Shop Details
Dashboard	4 stat cards + low stock alerts + quick action buttons
POS	Product grid + live cart + payment mode selector + bill preview
Inventory	Table view with stock status badges (OK / Low)
Udhaar	Credit cards with "Mark as Paid" action
AI Advisor	Chat interface with voice input + quick questions
🚀 Installation & Setup
Prerequisites
Node.js (v18+)
npm or yarn
MongoDB Atlas account (optional — fallback works without it)
Google Gemini API Key (optional — fallback works without it)
1. Clone the Repository
bash
git clone https://github.com/YOUR_USERNAME/antarya.git
cd antarya
2. Backend Setup
bash
cd server
npm install
Create a .env file in the server folder:
env
PORT=5000
MONGODB_URI=mongodb+srv://your-atlas-url/antarya
JWT_SECRET=antarya_demo_secret_2026
GEMINI_API_KEY=your-gemini-key-here
Start the server:
bash
node index.js
3. Frontend Setup
bash
cd ../client
npm install
npm run dev
4. Open in Browser
plain
http://localhost:5173
Demo Login Credentials
Phone: Any 10-digit number (e.g., 9876543210)
PIN: 1234
🔌 API Endpoints
Authentication
Table
Method	Endpoint	Description
POST	/api/auth/login	Login with phone + PIN
POST	/api/auth/register	Register new store owner
Inventory
Table
Method	Endpoint	Description
GET	/api/inventory	Get all items
POST	/api/inventory	Add new item
PUT	/api/inventory/:id	Update item
Sales
Table
Method	Endpoint	Description
GET	/api/sales	Get all sales
POST	/api/sales	Create new sale (auto-deducts stock)
Customers
Table
Method	Endpoint	Description
GET	/api/customers	Get all customers
POST	/api/customers	Add new customer
Udhaar (Credit)
Table
Method	Endpoint	Description
GET	/api/udhaar	Get all credit entries
POST	/api/udhaar	Add new credit entry
PUT	/api/udhaar/:id/pay	Mark credit as paid
AI Advisor
Table
Method	Endpoint	Description
POST	/api/advisor/ask	Ask AI question (context-aware)
Health Check
Table
Method	Endpoint	Description
GET	/health	Check server + database status
🔮 Future Scope
Table
Feature	Description
WhatsApp Automation	Auto-reminders for pending udhaar, low stock alerts
Multi-language Support	Tamil, Telugu, Marathi, Bengali regional support
Supplier Integration	Auto-restock when inventory hits threshold
Advanced Analytics	Monthly/Yearly profit charts, customer behavior heatmaps
Bhashini Integration	Full speech-to-text in 22 Indian languages
UPI Payment Gateway	Direct in-app UPI collection
Barcode Scanner	Camera-based product identification
Multi-store Support	Chain store management from single dashboard
🌍 Impact
ANTARYA has the potential to transform millions of small retail businesses across India:
📈 Increase Profits through intelligent insights and waste reduction
📉 Reduce Losses via proper inventory tracking and credit management
🤝 Improve Customer Relationships with personalized engagement
🧠 Bring AI Power to those who need it most — in a way that is accessible and natural
By turning everyday shop data into meaningful insights, ANTARYA helps transform a traditional store into a smart store.
👥 Contributors
Table
Name	Role
Team ANTARYA	Full Stack Development
📄 License
This project is built for educational and demonstration purposes.
<p align="center">
  <strong>ANTARYA — Dukan Smart, Zindagi Aasan. 🏪✨</strong>
</p>