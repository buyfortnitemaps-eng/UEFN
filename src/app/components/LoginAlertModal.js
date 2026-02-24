import { LogIn } from "lucide-react";
import Link from "next/link";

const LoginAlertModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card-bg border border-white/5 p-8 rounded-4xl w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95">
        <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn className="text-purple-500" size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Login Required</h2>
        <p className="text-gray-400 text-sm mb-8">
          Please login to your account to add assets to your cart and complete purchases.
        </p>
        <div className="flex flex-col gap-3">
          <Link 
            href="/auth/login" 
            className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold transition-all"
          >
            Login Now
          </Link>
          <button 
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-foreground transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginAlertModal;