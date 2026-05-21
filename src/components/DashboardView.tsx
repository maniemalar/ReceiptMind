import React from "react";
import { Sparkles, ShoppingBag, Plus, Info, ArrowUpRight, TrendingDown } from "lucide-react";
import { UserProfile, Expense } from "../types";
import { motion } from "motion/react";

interface DashboardViewProps {
  profile: UserProfile;
  expenses: Expense[];
  onNavigateToTab: (tab: "add" | "insights" | "goals" | "profile") => void;
  onOpenChat: () => void;
}

export default function DashboardView({ profile, expenses, onNavigateToTab, onOpenChat }: DashboardViewProps) {
  // Compute aggregated values
  const totalSpend = expenses.reduce((sum, item) => sum + item.total, 0);
  const formattedTotalSpend = totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  // Calculate category totals
  const diningCount = expenses.filter(e => e.category === "Dining & Drinks" || e.category === "Food & Drink").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-20"
    >
      {/* Welcome & Balance Highlight */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-on-surface-variant font-medium text-sm md:text-base">
            Good evening, <span className="font-bold text-primary">{profile.name}</span>
          </p>
          <h2 className="font-hanken text-3xl md:text-4xl font-extrabold text-primary tracking-tight mt-1">
            {profile.currency}{formattedTotalSpend}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full font-label-md text-xs flex items-center gap-1.5 font-semibold">
            <TrendingDown className="w-4.5 h-4.5 text-primary" />
            12% lower than last month
          </span>
          <span className="bg-tertiary/10 text-tertiary px-3 py-1.5 rounded-full font-label-md text-xs flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-4 h-4 text-tertiary" />
            On track for Paris
          </span>
        </div>
      </div>

      {/* Primary Bento Grid of Gauges & Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Wallet Health Arc Gauge Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <span className="tracking-wider text-[11px] font-bold text-slate-400 uppercase">Wallet Health</span>
              <h3 className="font-hanken font-bold text-lg text-primary mt-0.5">Budget Balance</h3>
            </div>
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold leading-none">
              Good
            </span>
          </div>

          <div className="relative flex flex-col items-center justify-center my-6">
            <svg className="w-44 h-24" viewBox="0 0 100 50">
              {/* Semi circle background arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="10"
                strokeDasharray="125.6 125.6"
              />
              {/* Semi circle foreground arc mapped to profile.walletHealth */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#4f378a"
                strokeWidth="10"
                strokeDasharray="125.6 125.6"
                strokeDashoffset={125.6 * (1 - profile.walletHealth / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute bottom-1 text-center">
              <span className="font-hanken text-3xl font-extrabold text-primary">{profile.walletHealth}</span>
              <span className="text-xs text-slate-400 block -mt-1">/ 100</span>
            </div>
          </div>
          
          <p className="text-center text-xs text-slate-400">
            Your general wallet health score is top 5% of Pro plan associates.
          </p>
        </div>

        {/* Weekly Overview Line Chart Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="tracking-wider text-[11px] font-bold text-slate-400 uppercase">Weekly Overview</span>
              <h4 className="font-hanken font-bold text-lg text-primary mt-0.5">Spend Rate Curve</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Avg / Day</span>
              <span className="block font-bold text-primary font-hanken text-sm">{profile.currency}{(totalSpend / 7).toFixed(0)}</span>
            </div>
          </div>

          <div className="w-full h-28 my-2 relative">
            {/* Custom high-fidelity smooth curve SVG with gradient */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f378a" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#4f378a" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              {/* Area map */}
              <path
                d="M 2,36 Q 15,22 30,28 T 60,18 T 85,29 T 98,12 L 98,40 L 2,40 Z"
                fill="url(#chartGlow)"
              />
              {/* Wave Line */}
              <path
                d="M 2,36 Q 15,22 30,28 T 60,18 T 85,29 T 98,12"
                fill="none"
                stroke="#4f378a"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Markers */}
              <circle cx="60" cy="18" r="2.2" fill="#4f378a" stroke="white" strokeWidth="1" />
              <circle cx="98" cy="12" r="2.2" fill="#765b00" stroke="white" strokeWidth="1" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-bold px-1 uppercase tracking-wider mt-2 border-t border-slate-50 pt-2 grid grid-cols-7 text-center">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>
        </div>

      </div>

      {/* Quick Access Activity Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => onNavigateToTab("add")}
          className="flex items-center gap-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-primary px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-100 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          ☕ Coffee
        </button>
        <button
          onClick={() => onNavigateToTab("add")}
          className="flex items-center gap-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-primary px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-100 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          🍔 Dining & Food
        </button>
        <button
          onClick={() => onNavigateToTab("add")}
          className="flex items-center gap-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-primary px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-100 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          🛒 Shopping
        </button>
        <button
          onClick={() => onNavigateToTab("add")}
          className="lg:flex flex items-center justify-center p-2 rounded-2xl bg-secondary-container hover:bg-purple-200 text-primary transition-all cursor-pointer shadow-sm border border-purple-100 shrink-0"
          aria-label="Add receipt"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Dynamic Recommendation Alert Banner */}
      <div className="relative group overflow-hidden rounded-3xl shadow-sm border border-slate-100 bg-white">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-tertiary rounded-3xl blur opacity-5 group-hover:opacity-10 transition duration-500" />
        <div className="relative p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-2xl bg-purple-50 text-primary shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-hanken font-bold text-sm text-primary uppercase tracking-wide">Smart AI Insight</span>
                <span className="bg-purple-100 text-primary px-2 py-0.5 rounded-full text-[9px] font-bold">GEMINI</span>
              </div>
              <p className="text-on-surface-variant text-sm mt-1 leading-relaxed max-w-xl">
                You've saved <span className="font-bold text-primary">{profile.currency}142.50</span> this month by optimizing meal delivery orders and reducing repeated coffee runs! Keep up the great pace.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenChat}
            className="w-full md:w-auto px-5 py-2.5 bg-primary hover:bg-primary-container text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
          >
            Ask ReceiptMind AI
            <ArrowUpRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-hanken font-bold text-lg text-primary">Recent Expenditures</h3>
          <button
            onClick={() => onNavigateToTab("insights")}
            className="text-xs text-primary font-bold hover:underline transition-all cursor-pointer"
          >
            Detailed Analytics &rarr;
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {expenses.slice(0, 3).map((item) => (
            <div key={item.id} className="py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50/50 flex items-center justify-center border border-purple-100/30">
                  <span className="font-bold text-sm">
                    {item.category === "Dining & Drinks" || item.category === "Food & Drink" ? "☕" : item.category === "Shopping" ? "🛒" : "🚗"}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-primary">{item.merchant}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{item.date} &bull; {item.category}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-hanken font-extrabold text-sm text-primary">
                  {profile.currency}{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{item.tags.join(", ")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
