import React from "react";
import { Bell } from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  profile: UserProfile;
  onNavigateToProfile: () => void;
  onNotificationsClick: () => void;
}

export default function Header({ profile, onNavigateToProfile, onNotificationsClick }: HeaderProps) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-50/85 backdrop-blur-xl border-b border-purple-100/50 shadow-sm z-50 flex justify-between items-center px-4 md:px-8 h-16">
      <div className="flex items-center gap-2 md:gap-3">
        <img
          alt="ReceiptMind Logo"
          className="h-9 w-auto object-contain"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp4xRCwDQGSSKL6jApIT-ZzIWuSDWPhEf8G3CY0v_yJ_mwWeQ5ACELaxgdayAJP9sdkRDDBsScd1BMssXS5aWjoE302i6LkvFZaA8UbDg3dTNN5aLUZkFw6xD3hwyYF-I6mbdJIVoCidULwB_-yZLT2k7UXY_HvpoP51JVPkuwxnsE-0bSyuCps9DIqXmXnGwM0i1KHsETcNuAwDdtuy1A0a5O1JYD0SgNTRWMF9X3fuRMxDjDOkg-jgcCXU6UM37ZPqDsVPPPKu0"
        />
        <h1 id="brand-title" className="font-hanken text-xl md:text-2xl font-bold tracking-tight text-primary">
          ReceiptMind
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onNotificationsClick}
          className="relative p-2 text-primary hover:bg-purple-50 rounded-full transition-colors active:scale-95 cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[2.2]" />
          {profile.notificationsEnabled && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error border border-white" />
          )}
        </button>
        <button
          onClick={onNavigateToProfile}
          className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-primary/10 hover:shadow-md transition-shadow active:scale-95 cursor-pointer"
        >
          <img
            alt="Maniemalar's Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVHnzatSneoOcpEbT3GKVMtSNUMlzyAsaaldLzl11zW7z0CSeUjfGf6SmI5M5qIm9Yia-RjlrVTnSB0IThASxEg6Gij3iPedrzXWeRcbaMv8EsdC6EkWwYWxisKg8DDdE-Gr7kURLtwheFVNZ5CY3ASpCYe_5ULORjD93mRnoEbgwU_3wh1gJBJDsG-dMNKoTCqtsdSgILMr5EkIi1Cn3qCgwpiOKn2Lb94wzFt0nK1o5ZV0UWQPSQ_XtrncSHmQLw7ZyF4xi_4rs"
          />
        </button>
      </div>
    </nav>
  );
}
