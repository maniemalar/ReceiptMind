export interface Expense {
  id: string;
  merchant: string;
  date: string;
  total: number;
  category: string;
  tags: string[];
  insight?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  joinedYear: string;
  plan: string;
  currency: string;
  walletHealth: number;
  monthlyBudget: number;
  dreamHomeTarget: number;
  dreamHomeSaved: number;
  parisTripTarget: number;
  parisTripSaved: number;
  newHomeTarget: number;
  newHomeSaved: number;
  notificationsEnabled: boolean;
  activeChannelsCount: number;
  theme: string;
  twoFactorEnabled: boolean;
  loggedDevices: number;
}

export type ViewType = "dashboard" | "add" | "insights" | "goals" | "profile";
