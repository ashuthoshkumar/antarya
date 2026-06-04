# ANTARYA

**The Ultimate AI-Powered Ecosystem for the Modern Kirana Store**

&gt; *"Apki Dukan Ka Digital Dimaag"* — Your Shop's Digital Brain

---

## Problem Statement

India has **12 million+ kirana stores** that still operate on pen and paper:

- **40% Inventory Waste** due to poor tracking
- **60% Unrecovered Credit (Udhaar)** — no proper record-keeping
- Manual billing with calculation errors
- Existing software too complex for local shopkeepers
- Language barrier — most apps are English-only

## Solution

ANTARYA is an AI-powered platform that acts like a **digital brain** for the shop:

- Conversational Hinglish support
- Zero complexity — hide technology behind friendly UI
- Works offline with automatic fallback

## Features

### 1. Smart Authentication
- Phone + 4-digit PIN login
- JWT-based secure sessions
- 2-step store registration

### 2. Smart Dashboard
- Today's Sales, Pending Udhaar, Low Stock Alerts, Estimated Profit
- One-click demo data loading

### 3. Smart POS
- One-click product selection
- Cash, UPI, Udhaar payment modes
- Auto inventory deduction
- Bill preview & print

### 4. Inventory Management
- Add/view stock items
- Category-wise organization
- Low stock alerts (highlighted when &lt; 10)

### 5. Udhaar (Credit) Management
- Track pending credits
- One-click "Mark as Paid"
- Total pending amount display

### 6. AI Advisory System
- Financial, Marketing, and Operations advisor
- Voice input in Hindi/Hinglish
- Powered by Google Gemini 2.5 Flash API
- Fallback responses when AI is unavailable

### 7. Resiliency
| Scenario | Fallback |
|----------|----------|
| No internet | In-memory DB activates |
| MongoDB down | Local memory database |
| AI quota exceeded | Smart pre-written responses |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + In-Memory Fallback |
| AI | Google Gemini 2.5 Flash API |
| Auth | JWT |
| Voice | Web Speech API |

## Installation

### Prerequisites
- Node.js v18+
- npm

### Backend Setup
```bash
cd server
npm install