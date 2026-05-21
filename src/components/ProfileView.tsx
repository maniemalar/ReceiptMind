import React from "react";
import { 
  User, ShieldCheck, Moon, Sun, Bell, Coins, LogOut, ArrowRight, 
  Sparkles, ShieldCheck as Lock, Database, Smartphone, CheckSquare 
} from "lucide-react";
import { UserProfile } from "../types";
import { motion } from "motion/react";

interface ProfileViewProps {
  profile: UserProfile;
  onChangeProfilePreference: (updates: Partial<UserProfile>) => void;
  onOpenChat: () => void;
}

export default function ProfileView({ profile, onChangeProfilePreference, onOpenChat }: ProfileViewProps) {
  // Toggle basic properties
  const handleToggleCurrency = () => {
    const nextCur = profile.currency === "RM" ? "$" : "RM";
    onChangeProfilePreference({ currency: nextCur });
  };

  const handleToggleNotifications = () => {
    onChangeProfilePreference({ notificationsEnabled: !profile.notificationsEnabled });
  };

  const handleToggle2FA = () => {
    onChangeProfilePreference({ twoFactorEnabled: !profile.twoFactorEnabled });
  };

  const handleSelectionTheme = () => {
    const nextTheme = profile.theme === "Airy Light" ? "Slate Dark Theme" : "Airy Light";
    onChangeProfilePreference({ theme: nextTheme });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-20 animate-in fade-in"
    >
      {/* Profile Card Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 pt-4">
        {/* Profile Avatar with status indicator ring */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 overflow-hidden shadow-md">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVHnzatSneoOcpEbT3GKVMtSNUMlzyAsaaldLzl11zW7z0CSeUjfGf6SmI5M5qIm9Yia-RjlrVTnSB0IThASxEg6Gij3iPedrzXWeRcbaMv8EsdC6EkWwYWxisKg8DDdE-Gr7kURLtwheFVNZ5CY3ASpCYe_5ULORjD93mRnoEbgwU_3wh1gJBJDsG-dMNKoTCqtsdSgILMr5EkIi1Cn3qCgwpiOKn2Lb94wzFt0nK1o5ZV0UWQPSQ_XtrncSHmQLw7ZyF4xi_4rs" 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-primary border-2 border-white flex items-center justify-center text-[10px]" />
        </div>

        <div>
          <h2 className="font-hanken font-extrabold text-xl md:text-2xl text-primary">{profile.name}</h2>
          <span className="bg-primary-fixed text-primary px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide mt-1.5 inline-block uppercase bg-purple-100">
            {profile.plan}
          </span>
          <p className="text-xs text-slate-400 font-semibold mt-3 max-w-xs mx-auto">
            Financial clarity and wealth orchestration since {profile.joinedYear}.
          </p>
        </div>
      </div>

      {/* Structured AI banner forecast card */}
      <div className="bg-gradient-to-r from-primary to-primary-container text-white rounded-3xl p-6 shadow-md shadow-primary/10 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-hanken font-bold text-sm tracking-wider uppercase text-purple-100 flex items-center gap-1.5 leading-none">
            <Sparkles className="w-4 h-4 text-tertiary-fixed font-bold" /> AI Saving Index
          </span>
          <span className="bg-white/10 text-white px-2.5 py-0.5 rounded-full text-[9px] font-extrabold">Active Coach</span>
        </div>
        <p className="text-xs md:text-sm text-purple-100 leading-relaxed font-semibold">
          Maniemalar, your saving index increased by <span className="font-extrabold text-white underline">12.4%</span> this month. Based on your current trajectory, you'll reach your "Paris celebration" milestone 2 months ahead of schedule!
        </p>
        <button
          onClick={onOpenChat}
          className="w-full py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none"
        >
          View Detailed Forecast <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Wallet health level indicator card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Wallet Score</span>
          <span className="text-primary">{profile.walletHealth} / 100</span>
        </div>
        <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${profile.walletHealth}%` }} />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold tracking-wide">
          <span>Target Score: 95</span>
          <span className="text-primary">Top 5% of all Pro users</span>
        </div>
      </div>

      {/* Preference Settings Section */}
      <div className="space-y-3">
        <h3 className="font-hanken font-bold text-base text-primary uppercase tracking-wide px-1">Preferences</h3>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100/50 overflow-hidden">
          
          {/* Item 1: Default Currency */}
          <button 
            onClick={handleToggleCurrency}
            className="w-full p-4 flex justify-between items-start hover:bg-slate-50/50 transition-colors cursor-pointer text-left focus:outline-none"
          >
            <div className="flex gap-4 items-center">
              <div className="p-2.5 rounded-xl bg-purple-50 text-primary">
                <Coins className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Set Default Currency</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Toggle preferred financial currency notation</p>
              </div>
            </div>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-extrabold uppercase">
              Current: {profile.currency} ({profile.currency === "RM" ? "MYR" : "USD"})
            </span>
          </button>

          {/* Item 2: Theme Settings */}
          <button 
            onClick={handleSelectionTheme}
            className="w-full p-4 flex justify-between items-start hover:bg-slate-50/50 transition-colors cursor-pointer text-left focus:outline-none"
          >
            <div className="flex gap-4 items-center">
              <div className="p-2.5 rounded-xl bg-purple-50 text-primary">
                {profile.theme === "Airy Light" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Theme Configurations</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Customize general appearance colors</p>
              </div>
            </div>
            <span className="bg-purple-15 text-primary border border-primary/15 px-3 py-1 rounded-full text-xs font-bold bg-purple-50">
              {profile.theme}
            </span>
          </button>

          {/* Item 3: Notifications channel toggle */}
          <button 
            onClick={handleToggleNotifications}
            className="w-full p-4 flex justify-between items-start hover:bg-slate-50/50 transition-colors cursor-pointer text-left focus:outline-none"
          >
            <div className="flex gap-4 items-center">
              <div className="p-2.5 rounded-xl bg-purple-50 text-primary">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Smart Alert Notifications</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Configure daily spend and milestone alarms</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase transition-colors ${
              profile.notificationsEnabled 
                ? "bg-emerald-50 text-emerald-600" 
                : "bg-slate-100 text-slate-500"
            }`}>
              {profile.notificationsEnabled ? `${profile.activeChannelsCount} Active` : "Disabled"}
            </span>
          </button>

        </div>
      </div>

      {/* Security settings */}
      <div className="space-y-3">
        <h3 className="font-hanken font-bold text-base text-primary uppercase tracking-wide px-1">Privacy & Security</h3>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100/50 overflow-hidden">
          
          {/* Two factor auth toggle */}
          <button 
            onClick={handleToggle2FA}
            className="w-full p-4 flex justify-between items-start hover:bg-slate-50/50 transition-colors cursor-pointer text-left focus:outline-none"
          >
            <div className="flex gap-4 items-center">
              <div className="p-2.5 rounded-xl bg-purple-50 text-primary">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Two-Factor Authentication</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Protect wallet credentials via authenticator codes</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
              profile.twoFactorEnabled 
                ? "bg-emerald-50 text-emerald-700" 
                : "bg-amber-50 text-amber-700 font-medium"
            }`}>
              {profile.twoFactorEnabled ? "Active" : "Standard Security"}
            </span>
          </button>

          {/* Data Privacy Row */}
          <div className="p-4 flex gap-4 items-center">
            <div className="p-2.5 rounded-xl bg-purple-50 text-primary shrink-0">
              <Database className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800">Data Privacy Ledger</h4>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Control how your financial transactions are shared & processed</p>
            </div>
          </div>

          {/* Logged in devices count */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="p-2.5 rounded-xl bg-purple-50 text-primary shrink-0">
                <Smartphone className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Logged-in Devices</h4>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage details of existing active sessions</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-slate-400">{profile.loggedDevices} Sessions (Last login: 2h ago)</span>
          </div>

        </div>
      </div>

      {/* Signout Button */}
      <button 
        onClick={() => alert("Simulating premium user sign-out...")}
        className="w-full py-4 max-w-sm mx-auto bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer border border-slate-250 transition-colors"
      >
        <LogOut className="w-4.5 h-4.5" />
        Sign out of Maniemalar
      </button>

    </motion.div>
  );
}
