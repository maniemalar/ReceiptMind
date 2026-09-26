# ReceiptMind

**ReceiptMind** is a mobile-first financial awareness web application designed to help university students and young working adults understand and manage their daily spending.

**Tagline:** *Turn Receipts Into Smarter Decisions.*

The application combines **AI-assisted receipt analysis** with manual expense tracking, allowing users to monitor spending patterns, receive financial insights, and manage financial goals.

---

## About the Project

Small recurring expenses such as food delivery, coffee, transport, subscriptions, and online shopping can accumulate without users noticing their impact on monthly spending.

ReceiptMind provides a simple and visually clean platform to help users record expenses and improve their financial awareness.

The project was developed for the **KD04503 Technopreneurship — Prompt to Prototype** task.

---

## Vibe Coding & AI-Assisted Development

A key learning experience from this project was understanding how **prompt engineering, vibe coding, and AI-assisted development tools** can be used to transform an idea into a functional prototype.

The development process used:

- **Google Stitch** for UI design and refinement
- **Google AI Studio** for functional prototype development
- **AI-assisted coding** for implementation and improvement
- **Netlify** for prototype deployment

The project also demonstrated the importance of using AI wisely. AI-generated outputs still need to be **reviewed, tested, understood, and refined** rather than being used blindly.

---

## Main Features

### Dashboard
- Monthly spending overview
- Spending Health score
- Weekly spending overview
- Expense category overview
- Smart financial insights

### Add Expense
- Upload receipt
- Manual expense entry
- AI-assisted receipt extraction
- Automatic expense categorisation

### AI Insights
- Spending observations
- Expense behaviour analysis
- Repeated spending pattern detection
- Financial awareness insights

### Financial Goals
- Monthly budget tracking
- Savings goals
- Category spending limits
- Goal progress monitoring

### Profile
- User profile
- Currency settings
- Notification preferences
- Account settings

---

## Technologies Used

- React
- TypeScript
- Vite
- Node.js
- Express.js
- Tailwind CSS
- Google Gemini / Google GenAI
- Google AI Studio
- Google Stitch
- Netlify

---

## Project Structure

A simplified representation of the project:

```text
ReceiptMind/
│
├── src/
│   ├── components/
│   │   ├── DashboardView.tsx
│   │   ├── AddExpenseView.tsx
│   │   ├── InsightsView.tsx
│   │   ├── GoalsView.tsx
│   │   ├── ProfileView.tsx
│   │   └── ChatWorkspace.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
│
├── server.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

> **Note:** This is a simplified project structure. Supporting, generated, dependency, and configuration files are omitted.

---

## How to Run

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ReceiptMind
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Configure the required environment variables based on `.env.example`, including the Gemini API key required for AI functionality.

> **Important:** Do not upload private API keys or credentials to a public GitHub repository.

### 4. Run the Project

```bash
npm run dev
```

---

## Author

**MANIEMALAR A/P MONEYUAL**

---

## Course Information

**Course:** KD04503 Technopreneurship  
**Task:** Individual Task 2 — Prompt to Prototype  
**Faculty:** Faculty of Computing and Informatics  
**University:** Universiti Malaysia Sabah (UMS)  
**Semester:** Semester 2, 2025/2026

---

## License

This project was developed for **educational and academic purposes only**.
