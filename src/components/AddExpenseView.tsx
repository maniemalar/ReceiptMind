import React, { useState, useRef } from "react";
import { 
  UploadCloud, FileText, Calendar, Building, Landmark, CheckCircle, 
  Sparkles, Loader2, Plus, Info, Check, Trash2 
} from "lucide-react";
import { UserProfile, Expense } from "../types";
import { motion } from "motion/react";

interface AddExpenseViewProps {
  profile: UserProfile;
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  onOpenChat: () => void;
}

// Visual descriptions & details for our sample receipt presets (ideal for testing)
const SAMPLE_RECEIPTS = [
  {
    name: "☕ Starbucks Cafe",
    desc: "RM 24.50 (Dining & Drinks)",
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=500&auto=format&fit=crop",
    base64Fake: "starbucks_base64_data_here"
  },
  {
    name: "🚗 Shell Petronas",
    desc: "RM 120.00 (Transport Fuel)",
    imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=500&auto=format&fit=crop",
    base64Fake: "petronas_base64_data_here"
  },
  {
    name: " Grocery Bill",
    desc: "RM 180.00 (Shopping)",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500&auto=format&fit=crop",
    base64Fake: "grocery_base64_data_here"
  }
];

export default function AddExpenseView({ profile, onAddExpense, onOpenChat }: AddExpenseViewProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extracted/Inputted fields
  const [merchant, setMerchant] = useState("");
  const [date, setDate] = useState("");
  const [total, setTotal] = useState("");
  const [category, setCategory] = useState("Dining & Drinks");
  const [selectedTags, setSelectedTags] = useState<string[]>(["#Personal"]);
  const [aiInsight, setAiInsight] = useState("");

  // Quick custom tags addition
  const [customTagInput, setCustomTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [availableTags, setAvailableTags] = useState(["#Business", "#Travel", "#Reimbursable", "#Personal"]);

  const handleTabChange = (tab: "upload" | "manual") => {
    setActiveTab(tab);
    setErrorMessage("");
    setProcessSuccess(false);
  };

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  // Convert files to base64 and process with Gemini
  const handleFileSelected = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage("");
    setProcessSuccess(false);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      await uploadToBackend(base64String, file.type);
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read image file.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  // Submit base64 receipt to server
  const uploadToBackend = async (base64Image: string, mimeType: string) => {
    try {
      const response = await fetch("/api/analyze-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image, mimeType })
      });

      const data = await response.json();
      if (data.success && data.data) {
        setMerchant(data.data.merchant);
        // Format ISO dates if needed
        setDate(data.data.date);
        setTotal(String(data.data.total));
        setCategory(data.data.category);
        setSelectedTags(data.data.tags || ["#Personal"]);
        setAiInsight(data.data.insight || "Analyzed successfully!");
        setProcessSuccess(true);
      } else {
        throw new Error(data.error || "Failed to extract particulars.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please try direct manual logging.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger processed values instantly for demo presets
  const handleSelectPreset = async (preset: typeof SAMPLE_RECEIPTS[0]) => {
    setIsProcessing(true);
    setErrorMessage("");
    setProcessSuccess(false);

    // Let's pass image link or mock string to backend
    // Since it's a seed preset, we simulate a very rapid parsing
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Fill detailed fields based on preset clicked
    if (preset.name.includes("Starbucks")) {
      setMerchant("Starbucks Curve");
      setDate("21/05/2026");
      setTotal("24.50");
      setCategory("Dining & Drinks");
      setSelectedTags(["#Personal"]);
      setAiInsight("Brewing coffee at home could save you RM600 by the end of the year.");
    } else if (preset.name.includes("Shell")) {
      setMerchant("Shell Petronas Station");
      setDate("20/05/2026");
      setTotal("120.00");
      setCategory("Transport");
      setSelectedTags(["#Travel", "#Business"]);
      setAiInsight("Petrol pricing is stable this week, driving logs are optimized.");
    } else {
      setMerchant("Village Grocer Bangsar");
      setDate("19/05/2026");
      setTotal("180.00");
      setCategory("Shopping");
      setSelectedTags(["#Personal"]);
      setAiInsight("Groceries match your budget target this week. Excellent planning!");
    }
    
    setIsProcessing(false);
    setProcessSuccess(true);
  };

  // Direct manual logging save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !date.trim() || !total.trim()) {
      setErrorMessage("Please complete the required merchant, date, and total amount fields.");
      return;
    }

    onAddExpense({
      merchant,
      date,
      total: Number(total),
      category,
      tags: selectedTags,
      insight: aiInsight || "Manually drafted entry."
    });

    // Reset fields
    setMerchant("");
    setDate("");
    setTotal("");
    setCategory("Dining & Drinks");
    setSelectedTags(["#Personal"]);
    setAiInsight("");
    setProcessSuccess(false);
    alert("Expense added to dashboard successfully!");
  };

  // Handle tagging selections
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTagInput.trim()) {
      const formatted = customTagInput.trim().startsWith("#") 
        ? customTagInput.trim() 
        : `#${customTagInput.trim()}`;
      
      if (!availableTags.includes(formatted)) {
        setAvailableTags([...availableTags, formatted]);
      }
      if (!selectedTags.includes(formatted)) {
        setSelectedTags([...selectedTags, formatted]);
      }
      setCustomTagInput("");
      setShowTagInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-20"
    >
      {/* Navigation Headers */}
      <div className="flex justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => handleTabChange("upload")}
          className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "upload" 
              ? "bg-primary text-white shadow-sm" 
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Upload Receipt
        </button>
        <button
          onClick={() => handleTabChange("manual")}
          className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "manual" 
              ? "bg-primary text-white shadow-sm" 
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Manual Entry
        </button>
      </div>

      {activeTab === "upload" && (
        <div className="space-y-6">
          {/* Preset receipt mockups for rapid testing */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Test Sample Invoices Instantaneously</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_RECEIPTS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className="p-3 bg-slate-50 hover:bg-purple-50/50 rounded-2xl border border-slate-100 font-medium text-left transition-colors active:scale-95 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h5 className="text-xs font-bold text-primary">{preset.name}</h5>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{preset.desc}</p>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </button>
              ))}
            </div>
          </div>

          {/* Core Upload Dragbox */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
              dragActive 
                ? "border-primary bg-purple-50/30" 
                : "border-slate-200 hover:border-primary bg-white hover:bg-slate-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <div>
                  <h4 className="font-hanken font-bold text-base text-primary">Gemini OCR Running...</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Evaluating merchant headers, line-item totals, and extracting categories using advanced LLM intelligence.</p>
                </div>
              </div>
            ) : processSuccess ? (
              <div className="flex flex-col items-center justify-center space-y-2 py-4 text-emerald-600">
                <CheckCircle className="w-12 h-12 text-emerald-500 fill-emerald-50" />
                <div>
                  <h4 className="font-hanken font-bold text-base text-emerald-700">Receipt processed successfully 🎉</h4>
                  <p className="text-xs text-emerald-600/70 mt-1">Review extracted financial details and insights below.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-hanken font-bold text-base text-primary">Drop receipt or click to scan</h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Supports JPG, PNG, and PDF receipt slips (Gemini-powered structure extraction)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Extracted form display */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-50 pb-3">
          <h3 className="font-hanken font-bold text-lg text-primary">Expense Details</h3>
          {processSuccess && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-primary px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" /> AI Parsed
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-semibold leading-relaxed">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Merchant Row */}
          <div className="space-y-1.5 animate-in fade-in">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Merchant</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Building className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder="e.g. Blue Bottle Coffee"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white text-slate-900 placeholder-slate-400 px-4 py-3 pl-11 rounded-2xl border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-1.5 animate-in fade-in">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Calendar className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. 24/10/2023"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white text-slate-900 placeholder-slate-400 px-4 py-3 pl-11 rounded-2xl border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Total Float input */}
            <div className="space-y-1.5 animate-in fade-in">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-semibold">Total Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-sm">
                  {profile.currency}
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white text-primary placeholder-slate-450 px-4 py-3 pl-11 rounded-2xl border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-extrabold transition-all"
                />
              </div>
            </div>
          </div>

          {/* Category Chip Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</span>
            <div className="flex flex-wrap gap-2">
              {["Dining & Drinks", "Shopping", "Transport", "Other"].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 border rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                    category === cat 
                      ? "bg-secondary-container text-primary border-primary shadow-sm" 
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat === "Dining & Drinks" ? "🍴 " : cat === "Shopping" ? "🛒 " : cat === "Transport" ? "🚗 " : "📁 "}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick tags pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Tags</span>
            <div className="flex flex-wrap gap-2 items-center">
              {availableTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-xs font-bold border rounded-xl cursor-pointer transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-purple-50/30 text-primary border-purple-100 hover:bg-purple-50/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
              
              {showTagInput ? (
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="tag"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomTag())}
                    className="px-2 py-1 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none w-16 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="p-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer transition-colors"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTagInput(true)}
                  className="w-8 h-8 rounded-full border border-dashed border-primary/25 text-primary flex items-center justify-center hover:bg-primary/5 cursor-pointer"
                  aria-label="Add custom tag"
                >
                  <Plus className="w-4 h-4 stroke-[2.3]" />
                </button>
              )}
            </div>
          </div>

          {/* Extracted AI spark analysis */}
          {aiInsight && (
            <div className="p-4 bg-tertiary/10 text-on-tertiary-container rounded-2xl text-xs space-y-1.5">
              <span className="font-extrabold uppercase tracking-wider text-[10px] text-tertiary flex items-center gap-1.5 leading-none">
                <Sparkles className="w-3.5 h-3.5" /> Dynamic AI Suggestion
              </span>
              <p className="font-semibold text-slate-700 leading-relaxed">{aiInsight}</p>
            </div>
          )}

          {/* Save submit */}
          <button
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary-container text-white font-bold text-sm tracking-wide rounded-2xl shadow-md hover:shadow-lg hover:shadow-primary/10 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            Save Expense
            <CheckCircle className="w-4.5 h-4.5" />
          </button>

        </form>
      </div>
    </motion.div>
  );
}
