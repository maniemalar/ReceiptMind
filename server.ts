import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Standard lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ GEMINI_API_KEY is not defined in the environment. Falling back to simulated AI mode.");
    }
    // Initialize GoogleGenAI SDK with required telemetry headers
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "15mb" }));

// In-memory simple storage for local persistence
let expenses = [
  {
    id: "1",
    merchant: "Blue Bottle Coffee",
    date: "24/10/2023",
    total: 12.50,
    category: "Dining & Drinks",
    tags: ["#Personal", "#Business"],
    insight: "Consider shifting some of your 'Weekend Brunch' budget to an investment container."
  },
  {
    id: "2",
    merchant: "Village Grocer",
    date: "18/10/2023",
    total: 180.00,
    category: "Shopping",
    tags: ["#Personal"],
    insight: "Groceries match your budget target this week. Excellent planning!"
  },
  {
    id: "3",
    merchant: "Petrol Petronas",
    date: "15/10/2023",
    total: 120.00,
    category: "Transport",
    tags: ["#Travel"],
    insight: "Fuel consumption is stable compared to your 30-day average."
  },
  {
    id: "4",
    merchant: "Bus Ticket RM",
    date: "20/10/2023",
    total: 15.00,
    category: "Transport",
    tags: ["#Business", "#Travel"],
    insight: "Public transport choice saved you RM45 in parking and toll fees."
  },
  {
    id: "5",
    merchant: "Mandarin Grill",
    date: "21/10/2023",
    total: 546.50,
    category: "Dining & Drinks",
    tags: ["#Personal", "#Reimbursable"],
    insight: "Dining spend has spiked. A critical warning alert was generated."
  }
];

let userProfile = {
  name: "Maniemalar",
  email: "maniemalar@gmail.com",
  joinedYear: "2022",
  plan: "Pro Plan Member",
  currency: "RM",
  walletHealth: 94,
  monthlyBudget: 3000.00,
  dreamHomeTarget: 1200000.00,
  dreamHomeSaved: 84000.00,
  parisTripTarget: 15000.00,
  parisTripSaved: 11250.00,
  newHomeTarget: 20000.00,
  newHomeSaved: 12000.00,
  notificationsEnabled: true,
  activeChannelsCount: 8,
  theme: "Airy Light",
  twoFactorEnabled: true,
  loggedDevices: 3
};

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// User profile API
app.get("/api/profile", (req, res) => {
  res.json(userProfile);
});

// Update profile customization preference
app.post("/api/profile/update", (req, res) => {
  const { currency, theme, notificationsEnabled, twoFactorEnabled } = req.body;
  if (currency !== undefined) userProfile.currency = currency;
  if (theme !== undefined) userProfile.theme = theme;
  if (notificationsEnabled !== undefined) userProfile.notificationsEnabled = notificationsEnabled;
  if (twoFactorEnabled !== undefined) userProfile.twoFactorEnabled = twoFactorEnabled;
  res.json({ success: true, profile: userProfile });
});

// Get Expense entries
app.get("/api/expenses", (req, res) => {
  res.json(expenses);
});

// Create high-fidelity expense
app.post("/api/expenses", (req, res) => {
  const { merchant, date, total, category, tags, insight } = req.body;
  
  if (!merchant || !date || total === undefined) {
    return res.status(400).json({ error: "Merchant, date and total are required" });
  }

  const newExpense = {
    id: Math.random().toString(36).substring(2, 9),
    merchant,
    date,
    total: Number(total),
    category: category || "Other",
    tags: tags || [],
    insight: insight || "Expense logged successfully!"
  };

  expenses = [newExpense, ...expenses];
  res.json({ success: true, expense: newExpense });
});

// delete expense
app.delete("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  expenses = expenses.filter(e => e.id !== id);
  res.json({ success: true });
});

// Real Gemini-powered Receipt Analyzer
app.post("/api/analyze-receipt", async (req, res) => {
  const { base64Image, mimeType } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: "No receipt image data supplied" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.log("No valid API Key found. Emulating Gemini AI receipt processing.");
    // Wait brief moment to simulate processing latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Provide a random high-quality mock response
    const mockOptions = [
      {
        merchant: "Starbucks Coffee",
        date: "21/05/2026",
        total: 24.50,
        category: "Dining & Drinks",
        tags: ["#Personal"],
        insight: "Brewing coffee at home could save you RM600 by the end of the year."
      },
      {
        merchant: "Grab Driver",
        date: "20/05/2026",
        total: 18.00,
        category: "Transport",
        tags: ["#Travel", "#Business"],
        insight: "Good choice taking shared transport, saving you parking cost."
      },
      {
        merchant: "IKEA Damansara",
        date: "19/05/2026",
        total: 145.00,
        category: "Shopping",
        tags: ["#Personal"],
        insight: "Home decor shopping logged. You are still within monthly budget limits."
      }
    ];
    const item = mockOptions[Math.floor(Math.random() * mockOptions.length)];
    return res.json({ success: true, source: "mock", data: item });
  }

  try {
    const ai = getGeminiClient();
    
    // Base64 cleaning
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const actualMimeType = mimeType || "image/png";

    const imagePart = {
      inlineData: {
        mimeType: actualMimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: `Extract financial particulars from this receipt. Populate all fields of the schema accurately. Interpret totals and dates. Give a smart and brief finance recommendation of max 15 words for the 'insight' property. Currencies should be parsed as bare numbers.`
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING, description: "Name of store or merchant" },
            date: { type: Type.STRING, description: "Purchase date in format DD/MM/YYYY" },
            total: { type: Type.NUMBER, description: "Total price as a clean float number" },
            category: { 
              type: Type.STRING, 
              description: "Must be exactly one of: Dining & Drinks, Shopping, Transport, Other" 
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 or 3 quick tags like '#Personal', '#Business', '#Travel', '#Reimbursable'"
            },
            insight: { type: Type.STRING, description: "A witty, smart actionable saving suggestion max 15 words" }
          },
          required: ["merchant", "date", "total", "category", "tags", "insight"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, source: "gemini", data: parsedData });

  } catch (error: any) {
    console.error("Gemini receipt analysis error: ", error);
    res.status(500).json({ error: error.message || "Failed to analyze receipt using Gemini AI." });
  }
});

// Generate dynamic AI Financial Health Forecast / Message Chat
app.post("/api/gemini-ask", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question prompt is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return gorgeous emulated AI chat response
    await new Promise(resolve => setTimeout(resolve, 1000));
    return res.json({
      answer: `Hello Maniemalar! As your **ReceiptMind AI** coach, I analyzed your recent spending:\n\n1. **Food Spikes**: Your Dining & Drinks segment is at **RM812** against your **RM800** budget (Critical Overrun).\n2. **Savings Potential**: Shifting 2 restaurant lunches/week to home meal prep could easily save you **RM200/month**, keeping you 100% on track for your **Japan Paris celebration** goal.\n\nIs there a specific transaction or category you want to drill into?`
    });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a premium AI financial concierge named 'ReceiptMind AI'. 
The user is 'Maniemalar', a Pro Plan member who has structured financial goals:
- Dream Home Fund: RM84k of RM1.2M saved (7.0% complete)
- Anniversary Paris Trip: RM11,250 of RM15k saved (75.0% complete)
- New Home Budget: RM12k of RM20k saved (60.0% complete)
- Monthly Expenses aggregate: RM2,450 spent of RM3,000 budget.
- Current Expense list summaries: ${JSON.stringify(expenses)}.

Provide highly professional, ultra-literate, encouraging and sharp financial coaching advice directly in response to the user's question. Maximize value in 3 short bullet points. Avoid dry lists; be creative, modern, and inspiring.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Gemini ask error: ", error);
    res.status(500).json({ error: error.message || "Gemini conversation failed." });
  }
});

// Vite Middleware integration or Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ReceiptMind server is running on http://localhost:${PORT}`);
  });
}

startServer();
