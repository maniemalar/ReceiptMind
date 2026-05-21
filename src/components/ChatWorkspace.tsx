import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, X, ArrowRight, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { UserProfile, Expense } from "../types";

interface ChatWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  expenses: Expense[];
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function ChatWorkspace({ isOpen, onClose, profile, expenses }: ChatWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "ai",
      text: `Hello Maniemalar! I am your **ReceiptMind AI** financial consultant. 
      I have analyzed your recent logs and noticed your **Dining & Drinks** segment is slightly tight.
      
      How can I assist you with your budget, receipt queries, or saving targets today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    const newUserMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputMessage("");
    setIsSending(true);

    try {
      const response = await fetch("/api/gemini-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText })
      });

      const data = await response.json();
      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "ai",
            text: data.answer,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error || "Failed to respond");
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: `⚠️ My connections are currently resetting. \n\nTemporary tip regarding your goals: You have saved **${profile.currency}${(profile.parisTripSaved).toLocaleString()}** towards your **Anniversary Paris Trip** (${( (profile.parisTripSaved / profile.parisTripTarget) * 100 ).toFixed(0)}%). Consider transferring RM100 this week to maintain pace!`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col relative animate-in slide-in-from-right duration-300">
        
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-primary to-primary-container text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-tertiary-fixed font-bold animate-pulse" />
            </div>
            <div>
              <h3 className="font-hanken font-bold text-lg leading-tight">ReceiptMind AI</h3>
              <p className="text-xs text-purple-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Active Financial Consultant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Context Panel */}
        <div className="bg-purple-50/50 p-3 border-b border-purple-100 flex items-center justify-between text-xs text-primary font-medium px-4">
          <span>Active Context: {expenses.length} Transactions</span>
          <span className="bg-primary/10 px-2 py-0.5 rounded-full">
            Budget Health: {profile.walletHealth}/100
          </span>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === "user" ? "bg-primary text-white" : "bg-purple-100 text-primary"
                }`}
              >
                {msg.sender === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-tr-none font-medium"
                    : "bg-white text-on-surface border border-purple-100/50 rounded-tl-none whitespace-pre-wrap"
                }`}
              >
                {msg.text}
                <span
                  className={`block text-[10px] mt-2 text-right ${
                    msg.sender === "user" ? "text-purple-200" : "text-gray-400"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white text-on-surface border border-purple-100/50 rounded-2xl rounded-tl-none p-4 shadow-sm text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="animate-pulse">ReceiptMind AI is evaluating expenditures...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="p-3 border-t border-slate-100 bg-white overflow-x-auto flex gap-2 no-scrollbar">
          <button
            onClick={() => setInputMessage("How much can I save on food delivery?")}
            className="shrink-0 text-xs px-3 py-1.5 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-primary rounded-full transition-colors border border-slate-100 cursor-pointer"
          >
            🍔 Dining recommendations
          </button>
          <button
            onClick={() => setInputMessage("Will I reach my Anniversary Paris Trip goal on time?")}
            className="shrink-0 text-xs px-3 py-1.5 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-primary rounded-full transition-colors border border-slate-100 cursor-pointer"
          >
            🗼 Paris Trip Milestone
          </button>
          <button
            onClick={() => setInputMessage("Explain my current wallet score")}
            className="shrink-0 text-xs px-3 py-1.5 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-primary rounded-full transition-colors border border-slate-100 cursor-pointer"
          >
            🛡️ Score breakdown
          </button>
        </div>

        {/* Chat input submit */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask ReceiptMind AI anything..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="p-2.5 bg-primary hover:bg-primary-container disabled:opacity-50 text-white rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
