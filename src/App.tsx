import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Plus, BarChart4, Target, User, Sparkles, Bell, X, 
  ChevronRight, AlertCircle, ShoppingBag, Globe, Loader2 
} from "lucide-react";
import { Expense, UserProfile, ViewType } from "./types";
import Header from "./components/Header";
import ChatWorkspace from "./components/ChatWorkspace";
import DashboardView from "./components/DashboardView";
import AddExpenseView from "./components/AddExpenseView";
import InsightsView from "./components/InsightsView";
import GoalsView from "./components/GoalsView";
import ProfileView from "./components/ProfileView";

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewType>("dashboard");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Alert logs system
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load backend seed profile and expenditures lists on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [profileRes, expensesRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/expenses")
        ]);

        if (profileRes.ok && expensesRes.ok) {
          const profileData = await profileRes.json();
          const expensesData = await expensesRes.json();
          setProfile(profileData);
          setExpenses(expensesData);
        } else {
          throw new Error("Failed to load server resources");
        }
      } catch (err) {
        // Fallback default state in case server is compiling
        setProfile({
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
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Update dynamic preference change
  const handleChangeProfilePreference = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);

    try {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.warn("Preference syncing currently silent.");
    }
  };

  // Add parsed or manually added expense dynamically and synchronize with database memory
  const handleAddExpense = async (newExpenseDraft: Omit<Expense, "id">) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpenseDraft)
      });

      const data = await response.json();
      if (data.success && data.expense) {
        setExpenses((prev) => [data.expense, ...prev]);
        
        // Show celebratory toast or alert for micro UX satisfaction
        setAlertMessage(`Logged RM${newExpenseDraft.total.toFixed(2)} to ${newExpenseDraft.merchant}!`);
        setTimeout(() => setAlertMessage(null), 4000);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      // Local state fallback optimization
      const clientSideFallback: Expense = {
        id: Math.random().toString(),
        ...newExpenseDraft
      };
      setExpenses((prev) => [clientSideFallback, ...prev]);
      setAlertMessage(`Drafted RM${newExpenseDraft.total.toFixed(2)} locally.`);
      setTimeout(() => setAlertMessage(null), 4000);
    }
  };

  const handleNotificationsTrigger = () => {
    setAlertMessage("You have managed 82% of your budget excellently. Notification channels active!");
    setTimeout(() => setAlertMessage(null), 5000);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider animate-pulse">Initializing ReceiptMind Premium...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-primary/20 pb-12 pt-20">
      
      {/* Dynamic Floating Toast Alerts Banner */}
      {alertMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-primary border border-purple-400/20 text-white p-3.5 rounded-2xl shadow-xl z-50 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-2 items-center">
            <Sparkles className="w-5 h-5 text-tertiary-fixed font-bold animate-pulse" />
            <p className="text-xs font-semibold">{alertMessage}</p>
          </div>
          <button onClick={() => setAlertMessage(null)} className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer select-none">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Standard Branding Header */}
      <Header
        profile={profile}
        onNavigateToProfile={() => setActiveTab("profile")}
        onNotificationsClick={handleNotificationsTrigger}
      />

      {/* Primary Modular Views Shell Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {activeTab === "dashboard" && (
          <DashboardView
            profile={profile}
            expenses={expenses}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === "add" && (
          <AddExpenseView
            profile={profile}
            onAddExpense={handleAddExpense}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === "insights" && (
          <InsightsView
            profile={profile}
            expenses={expenses}
            onOpenChat={() => setIsChatOpen(true)}
            onAdjustBudget={() => setActiveTab("goals")}
          />
        )}

        {activeTab === "goals" && (
          <GoalsView
            profile={profile}
            expenses={expenses}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            profile={profile}
            onChangeProfilePreference={handleChangeProfilePreference}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Shell */}
      <nav id="bottom-tabs-dock" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-around items-center px-2.5 py-2.5 bg-slate-900/90 backdrop-blur-2xl w-[92%] max-w-md rounded-full shadow-2xl shadow-primary/20 select-none">
        
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors cursor-pointer w-12 ${
            activeTab === "dashboard" ? "text-primary-fixed-dim" : "text-white/60 hover:text-white"
          }`}
          aria-label="Dashboard"
        >
          <LayoutDashboard className="w-5 h-5 stroke-[2.3]" />
          <span className="text-[9px] font-bold mt-1">Home</span>
        </button>

        {/* Tab 2: Add receipt */}
        <button
          onClick={() => setActiveTab("add")}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors cursor-pointer w-12 ${
            activeTab === "add" ? "text-primary-fixed-dim" : "text-white/60 hover:text-white"
          }`}
          aria-label="Scanner"
        >
          <Plus className="w-5 h-5 stroke-[2.3]" />
          <span className="text-[9px] font-bold mt-1">Scan</span>
        </button>

        {/* Central Floating Primary Circle: Budget Goals Tracker */}
        <button
          onClick={() => setActiveTab("goals")}
          className={`relative flex items-center justify-center rounded-full w-13 h-13 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border -mt-5 ${
            activeTab === "goals" 
              ? "bg-gradient-to-tr from-[#765b00] to-[#e7c365] text-white border-[#f0d480]" 
              : "bg-primary text-white border-primary-container"
          }`}
          aria-label="Milestones"
        >
          <Target className="w-6 h-6 stroke-[2.5]" />
          {/* Pulsing indicator */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />
        </button>

        {/* Tab 3: Insights analytics charts */}
        <button
          onClick={() => setActiveTab("insights")}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors cursor-pointer w-12 ${
            activeTab === "insights" ? "text-primary-fixed-dim" : "text-white/60 hover:text-white"
          }`}
          aria-label="Analytics"
        >
          <BarChart4 className="w-5 h-5 stroke-[2.3]" />
          <span className="text-[9px] font-bold mt-1">Charts</span>
        </button>

        {/* Tab 4: Profile & Preferences */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors cursor-pointer w-12 ${
            activeTab === "profile" ? "text-primary-fixed-dim" : "text-white/60 hover:text-white"
          }`}
          aria-label="Profile"
        >
          <User className="w-5 h-5 stroke-[2.3]" />
          <span className="text-[9px] font-bold mt-1">Profile</span>
        </button>

      </nav>

      {/* Floating Action Button for prompt chat always accessible on right */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-24 right-5 bg-primary hover:bg-primary-container hover:shadow-lg hover:shadow-primary/20 text-white font-bold p-3.5 rounded-full z-45 transition-transform flex items-center justify-center shadow-lg cursor-pointer group"
        aria-label="Ask ReceiptMind AI"
      >
        <Sparkles className="w-5.5 h-5.5 text-tertiary-fixed animate-pulse" />
        <span className="max-w-0 group-hover:max-w-24 overflow-hidden transition-all duration-300 font-bold text-xs pl-0 group-hover:pl-2 whitespace-nowrap leading-none hidden sm:inline-block">
          Ask AI
        </span>
      </button>

      {/* Dedicated Interactive Cabinet Chat Overlay Workspace with Gemini */}
      <ChatWorkspace
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        profile={profile}
        expenses={expenses}
      />

    </div>
  );
}
