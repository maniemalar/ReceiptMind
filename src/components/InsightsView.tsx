import React from "react";
import { 
  Heart, ArrowRight, Utensils, AlertTriangle, Lightbulb, PiggyBank, 
  Sparkles, TrendingUp, Calendar, ChevronRight 
} from "lucide-react";
import { UserProfile, Expense } from "../types";
import { motion } from "motion/react";

interface InsightsViewProps {
  profile: UserProfile;
  expenses: Expense[];
  onOpenChat: () => void;
  onAdjustBudget?: () => void;
}

export default function InsightsView({ profile, expenses, onOpenChat, onAdjustBudget }: InsightsViewProps) {
  // Aggregate data for standard values matching the screens
  const score = 82; // Spend efficiency rating
  const foodDeliveryOver = 18; // percent increase

  // Monthly trend seed data as shown in the screenshot Screen 4
  const trendData = [
    { month: "Aug", spent: 2300, budget: 3000, color: "bg-primary" },
    { month: "Sep", spent: 2500, budget: 3000, color: "bg-primary" },
    { month: "Oct", spent: 1800, budget: 3000, color: "bg-primary" },
    { month: "Nov", spent: 2450, budget: 3000, color: "bg-primary" }, // Active Highlight (Primary purple)
    { month: "Dec", spent: 1900, budget: 3000, color: "bg-primary animate-pulse" },
    { month: "Jan", spent: 1400, budget: 2000, color: "bg-tertiary" } // Highlights (Gold/Accent)
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-20"
    >
      {/* Financial Health Ring Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <h3 className="font-hanken font-bold text-lg text-primary self-start">Financial Health</h3>
        <p className="text-xs text-slate-400 font-semibold self-start mt-0.5">Your spending efficiency score this month</p>
        
        {/* Large circle progress gauge */}
        <div className="relative w-40 h-40 my-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-100/80"
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="currentColor"
              strokeWidth="9"
            />
            <circle
              className="text-primary"
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="currentColor"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 * (1 - score / 100)}
              strokeLinecap="round"
              strokeWidth="9"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-hanken text-4xl font-extrabold text-primary leading-none">{score}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Excellent</span>
          </div>
        </div>

        {/* Dual Pill Status */}
        <div className="flex justify-center gap-3 w-full">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            Budget Mastery
          </span>
          <span className="bg-tertiary/10 text-tertiary px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block" />
            Smart Saver
          </span>
        </div>
      </div>

      {/* Structured Smart Insights */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-hanken font-bold text-lg text-primary flex items-center gap-1">
            Smart Insights <Sparkles className="w-4 h-4 text-tertiary fill-tertiary/20" />
          </h3>
          <button
            onClick={onOpenChat}
            className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
          >
            Ask ReceiptMind AI
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 1: Dining Spikes */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-start">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="font-bold text-sm text-slate-800 leading-tight">Food Delivery Alert</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Food delivery increased by <span className="font-extrabold text-rose-600">{foodDeliveryOver}%</span> compared to last month.
            </p>
            <button
              onClick={onOpenChat}
              className="text-xs text-primary font-bold inline-flex items-center gap-1 hover:underline cursor-pointer pt-1"
            >
              Learn how to cut back <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Micro spend optimization */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-start">
          <div className="w-11 h-11 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="font-bold text-sm text-slate-800 leading-tight">Savings Opportunity</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              You could save <span className="font-extrabold text-primary">RM60 monthly</span> by configuring standard caps over tiny automated purchases.
            </p>
            <button
              onClick={onOpenChat}
              className="text-xs text-primary font-bold inline-flex items-center gap-1 hover:underline cursor-pointer pt-1"
            >
              Set a daily cap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Trend 6 month chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <h3 className="font-hanken font-bold text-base text-primary">Monthly Trend</h3>
          <div className="flex justify-between items-center mt-1">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Spending vs Budget over 6 months</p>
            <div className="flex gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary block" /> Spent
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 block border border-slate-200" /> Budget
              </span>
            </div>
          </div>
        </div>

        {/* Visualized vertical bars in SVG / Flex design */}
        <div className="h-44 flex items-end justify-between px-2 pt-6 border-b border-slate-100">
          {trendData.map((data) => {
            // Calculate relative heights up to max budget (3000)
            const spentHeightPercent = (data.spent / 3000) * 100;
            const remainingHeightPercent = 100 - spentHeightPercent;

            return (
              <div key={data.month} className="flex flex-col items-center w-12 group">
                {/* Stack box container */}
                <div className="relative w-7 h-28 bg-slate-100 rounded-lg overflow-hidden flex flex-col justify-end border border-slate-50 shadow-inner">
                  {/* Spent filling bar */}
                  <div
                    className={`w-full ${data.color} rounded-t-sm`}
                    style={{ height: `${spentHeightPercent}%`, transition: "height 0.8s ease" }}
                  />
                </div>
                {/* Month label */}
                <span className="text-xs font-bold text-slate-500 mt-2">{data.month}</span>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-slate-400 font-semibold leading-relaxed">
          Highlight: Gold bars identify targeted goals. Purple represents aggregate recurring expenses.
        </p>
      </div>
    </motion.div>
  );
}
