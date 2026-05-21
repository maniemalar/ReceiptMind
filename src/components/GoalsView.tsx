import React, { useState } from "react";
import { 
  Sparkles, TrendingDown, Lightbulb, ChevronRight, AlertTriangle, 
  Plus, Calendar, Target, DollarSign, PiggyBank, Heart 
} from "lucide-react";
import { UserProfile, Expense } from "../types";
import { motion } from "motion/react";

interface GoalsViewProps {
  profile: UserProfile;
  expenses: Expense[];
  onOpenChat: () => void;
  onRefreshProfile?: () => void;
}

export default function GoalsView({ profile, expenses, onOpenChat, onRefreshProfile }: GoalsViewProps) {
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalSaved, setNewGoalSaved] = useState("");

  const [localGoals, setLocalGoals] = useState([
    {
      id: "1",
      name: "Dream Home Fund",
      target: 1200000,
      saved: 84000,
      milestone: "Milestone 1 (10%)",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOjb5qI170PSiR0v1mJi0eBKEiXULdTsgip8_6Xo5-AIBp1NA5SU9FxnrBwWU_7ewMrOKdqi9hZ5dG_Mlu_6clFniG6OpWpbzMShtA7C3M7pVwRahR1tzt12xz_yQ6x3HDj4eVyfAqDAC-O-_PrG4MKdfwEmIm82sGgMuuBji-0Bkq7QjqSnHDEzLhoR7s3c2nax-LO6MnHLGVZO1dIbYh2U-0hzyWj3LuxWq2xJE2DfIv3vcEECsSIYQCRbempSKpN7lfdszXAcc"
    },
    {
      id: "2",
      name: "Anniversary Paris Trip",
      target: 15000,
      saved: 11250,
      milestone: "June 2026 Celebration",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVQ-0fuupO1C23oci_twvnXVJCK19Fl42XignoqgizVypzGqKtAJb3eDVrM985xqVXzdrWiQPsmvufBXqelmIPhrvJPOmDqGxiE8FNueis3LD85qasKlX3fhcY2seaXiQEjuLgcZdcDFt3yEbAgGyYRRCvFm3j2U3mjfUU5ri36YvbKL5maARecEZYAWAi27i0diOTWiWhL93l6kZPvBWEheXIj7baGI2g8e83sE1Bor9aqe1-kqM5E05zxV3LCX7PEuEmV0nx_jg"
    }
  ]);

  // Aggregate current month spend limits
  const totalSpend = expenses.reduce((sum, item) => sum + item.total, 0);
  const monthlyLimit = profile.monthlyBudget;
  const leftOver = Math.max(0, monthlyLimit - totalSpend);
  const spentPercent = Math.min(100, Math.round((totalSpend / monthlyLimit) * 100));

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalTarget.trim()) return;

    const newGoalObj = {
      id: Math.random().toString(),
      name: newGoalName,
      target: Number(newGoalTarget),
      saved: Number(newGoalSaved) || 0,
      milestone: "Interactive Dynamic Target",
      img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=500&auto=format&fit=crop"
    };

    setLocalGoals([...localGoals, newGoalObj]);
    setNewGoalName("");
    setNewGoalTarget("");
    setNewGoalSaved("");
    setShowAddGoalModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-20"
    >
      {/* Title block */}
      <div className="space-y-2">
        <h2 className="font-hanken font-extrabold text-2xl md:text-3xl text-primary leading-tight">
          {profile.currency}{leftOver.toLocaleString(undefined, { minimumFractionDigits: 2 })} left for this month
        </h2>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-xl">
          You've managed {spentPercent}% of your monthly budget excellently. Keeping this pace will put you {profile.currency}1,200 over your savings target by year-end.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1">
          <span className="bg-primary/5 text-primary px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5" /> 12% lower than last month
          </span>
          <span className="bg-tertiary/10 text-tertiary px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-tertiary" /> On track for "Paris Celebration"
          </span>
        </div>
      </div>

      {/* Smart Insight spotlight card */}
      <div className="relative group overflow-hidden rounded-3xl border border-slate-100 bg-white">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-tertiary rounded-3xl blur opacity-5 group-hover:opacity-10 transition duration-500" />
        <div className="relative p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-tertiary/10 text-tertiary rounded-2xl shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-extrabold text-tertiary tracking-wider flex items-center gap-1">
              Smart Insight ✨
            </span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            Based on your dining patterns, you could save an extra <span className="font-bold text-primary">{profile.currency}200/month</span> by shifting your "Weekend Brunch" budget to your "Investment Portfolio".
          </p>
          <button
            onClick={onOpenChat}
            className="w-full py-3 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-2xl transition-all shadow-sm cursor-pointer"
          >
            Adjust Budget Now
          </button>
        </div>
      </div>

      {/* Progress Rings Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Monthly Budget Ring */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="relative w-36 h-36 my-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-slate-100/70" cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="8" />
              <circle 
                className="text-primary" 
                cx="50" 
                cy="50" 
                fill="none" 
                r="40" 
                stroke="currentColor" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 * (1 - spentPercent / 100)} 
                strokeLinecap="round" 
                strokeWidth="8" 
                style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-hanken text-2xl font-extrabold text-primary">{spentPercent}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Spent</span>
            </div>
          </div>
          <h4 className="font-hanken font-bold text-base text-primary">Monthly Budget</h4>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {profile.currency}{totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })} of {profile.currency}{monthlyLimit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>

        {/* New Home / Goal Ring */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="relative w-36 h-36 my-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-slate-100/70" cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="8" />
              <circle 
                className="text-tertiary" 
                cx="50" 
                cy="50" 
                fill="none" 
                r="40" 
                stroke="currentColor" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 * (1 - 0.60)} 
                strokeLinecap="round" 
                strokeWidth="8" 
                style={{ transition: "stroke-dashoffset 0.8s/ea" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-hanken text-2xl font-extrabold text-tertiary">60%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Saved</span>
            </div>
          </div>
          <h4 className="font-hanken font-bold text-base text-primary">New Home Goal</h4>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {profile.currency}{profile.newHomeSaved.toLocaleString()} of {profile.currency}{(profile.newHomeTarget / 1000).toLocaleString()}k
          </p>
        </div>

      </div>

      {/* Category Health Indicators */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-hanken font-bold text-lg text-primary">Category Health</h3>
          <span className="text-xs text-slate-400 font-bold">Live Status</span>
        </div>

        <div className="space-y-4">
          
          {/* Card: Food Over budget warning */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                🍴 Dining & Drinks
              </span>
              <span className="bg-error text-white text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Critical
              </span>
            </div>
            {/* Limit scale */}
            <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-error rounded-full" style={{ width: "98%" }} />
            </div>
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-error">Over budget by RM12</span>
              <span className="text-slate-400">RM812 / RM800</span>
            </div>
          </div>

          {/* Card: Transport in range */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                🚗 Transport
              </span>
              <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
                Optimal
              </span>
            </div>
            {/* Limit scale */}
            <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-tertiary rounded-full" style={{ width: "45%" }} />
            </div>
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-emerald-600">RM180 remaining</span>
              <span className="text-slate-400">RM220 / RM400</span>
            </div>
          </div>

        </div>
      </div>

      {/* Financial Goals section list */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="font-hanken font-bold text-lg text-primary">Financial Goals</h3>
            <p className="text-xs text-slate-400 font-medium">Active milestones you are working towards</p>
          </div>
          <button
            onClick={() => setShowAddGoalModal(true)}
            className="px-4 py-2.5 bg-secondary-container hover:bg-purple-200 text-primary rounded-2xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-purple-100"
          >
            <Plus className="w-4.5 h-4.5" />
            Create Goal
          </button>
        </div>

        {/* Goal Card List */}
        <div className="space-y-4">
          {localGoals.map((g) => {
            const completionPercent = Math.min(100, Math.round((g.saved / g.target) * 100));
            const isCompleted = completionPercent >= 100;

            return (
              <div 
                key={g.id} 
                className="bg-white rounded-3xl p-4 shadow-sm border border-slate-150/50 flex flex-col sm:flex-row gap-4 items-center hover:shadow-md transition-shadow group overflow-hidden"
              >
                <div className="w-full sm:w-40 h-28 rounded-2xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-100">
                  <img src={g.img} alt={g.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-primary">
                    MILESTONE
                  </div>
                </div>

                <div className="flex-1 space-y-2.5 w-full">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">{g.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 font-semibold">Target: {profile.currency}{g.target.toLocaleString()} &bull; {g.milestone}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-hanken font-extrabold text-[#765b00] block text-base">
                        {profile.currency}{g.saved.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Current Balance</span>
                    </div>
                  </div>

                  {/* Complete bar indicator */}
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-[#765b00] rounded-full" 
                        style={{ width: `${completionPercent}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-bold select-none text-slate-400">
                      <span>{profile.currency}0</span>
                      <span className="text-primary">{completionPercent}% Complete</span>
                      <span>{profile.currency}{(g.target >= 1000000) ? `${(g.target / 1000000).toFixed(1)}M` : `${(g.target / 1000).toFixed(0)}k`}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-hanken font-bold text-lg text-primary">Create New Milestone</h3>
              <button 
                onClick={() => setShowAddGoalModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
            
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dream Home Fund / Japan Tour"
                  required
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Target ({profile.currency})</label>
                  <input
                    type="number"
                    placeholder="15000"
                    required
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Saved Initial</label>
                  <input
                    type="number"
                    placeholder="2500"
                    value={newGoalSaved}
                    onChange={(e) => setNewGoalSaved(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/10 transition-transform active:scale-[0.98] cursor-pointer"
              >
                Add Milestones &rarr;
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
