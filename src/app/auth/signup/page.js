/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Gamepad2, LogOut } from "lucide-react"; // LogOut আইকন যোগ করা হয়েছে
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signUpWithEmail,
  updateUserProfile,
  signInWithGoogle,
} from "../../lib/firebaseActions";
import { useAuth } from "../../../app/context/AuthContext"; // AuthContext ব্যবহার করুন
import { handleSignOut } from "../../utils/handleSIgnout";

const SignUp = () => {
  const { user, loading: authLoading } = useAuth(); // গ্লোবাল ইউজার স্টেট নিন
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const saveUserIntoDB = async (firebaseUser, name) => {
    try {
      const response = await fetch(
        "https://uefn-maps-server.vercel.app/api/v1/users/create-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || firebaseUser.displayName,
            email: firebaseUser.email,
            firebaseUid: firebaseUser.uid,
            image: firebaseUser.photoURL || "",
            role: "user",
          }),
        },
      );

      const result = await response.json();
      return result; // এটি success: true অথবা false পাঠাবে
    } catch (error) {
      console.error("Backend Error:", error);
      return { success: false };
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    let firebaseUser = null;

    try {
      const res = await signUpWithEmail(formData.email, formData.password);
      firebaseUser = res.user;

      await updateUserProfile(formData.name);
      const dbResponse = await saveUserIntoDB(firebaseUser, formData.name);

      if (dbResponse && dbResponse.success) {
        router.push("/assets");
      } else {
        throw new Error("Database sync failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error.message);
      if (firebaseUser) {
        await firebaseUser.delete();
      }

      alert(error.message || "Something went wrong during signup.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAction = async () => {
    try {
      const res = await signInWithGoogle();
      await saveUserIntoDB(res.user);
      router.push("/assets");
    } catch (error) {
      console.error(error.message);
    }
  };

  if (authLoading) return null; // অথেন্টিকেশন চেক হওয়া পর্যন্ত অপেক্ষা করুন

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20 relative overflow-hidden text-foreground">
      {/* --- FIXED BACKGROUND ELEMENTS (SCROLL FIXED) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 1. DOT GRID BACKGROUND */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* 2. TOP GLOW LIGHT */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/20 blur-[180px] rounded-full" />

        {/* 3. BOTTOM GLOW LIGHT */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-200 h-full bg-purple-600/15 blur-[150px] rounded-full" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/2 border border-white/5 rounded-[3rem] p-8 md:p-14 backdrop-blur-xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/20">
              <Gamepad2 className="text-foreground" size={32} />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              {user ? "Account" : "Join"}{" "}
              <span className="text-purple-500">
                {user ? "Active" : "UEFN"}
              </span>
            </h1>
            <p className="text-gray-500 mt-2">
              {user
                ? `Logged in as ${user.email}`
                : "Start your creative journey today."}
            </p>
          </div>

          {user ? (
            /* --- ইউজার লগইন থাকলে এই বাটনটি দেখাবে --- */
            <div className="space-y-6">
              <div className="p-6 bg-background border border-white/5 rounded-2xl text-center">
                <p className="text-gray-400 text-sm mb-4 font-medium italic">
                  You are already signed in. To create a new account, please
                  sign out first.
                </p>
                <button
                  onClick={() => handleSignOut()}
                  className="w-full bg-red-600/20 text-red-500 border border-red-500/30 py-4 rounded-2xl font-black text-lg hover:bg-red-600 hover:text-foreground transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <LogOut size={20} /> Sign Out
                </button>
              </div>
              <Link
                href="/assets"
                className="block text-center text-purple-500 font-bold hover:underline"
              >
                Go to My Assets →
              </Link>
            </div>
          ) : (
            /* --- ইউজার লগইন না থাকলে ফর্ম দেখাবে --- */
            <>
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-card-bg border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500/50 transition-all font-medium text-sm"
                  />
                </div>

                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors"
                    size={18}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-card-bg border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500/50 transition-all font-medium text-sm"
                  />
                </div>

                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors"
                    size={18}
                  />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-card-bg border border-white/5 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-purple-500/50 transition-all font-medium text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-foreground py-5 rounded-2xl font-black text-lg hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </form>

              <div className="mt-8">
                <button
                  onClick={handleGoogleAction}
                  className="w-full bg-background border border-white/5 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
                >
                  <img
                    src="/google.webp"
                    className="w-6 h-6 rounded-full "
                    alt="Google"
                  />{" "}
                  Sign up with Google
                </button>
              </div>

              <p className="text-center mt-10 text-gray-500 text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-foreground font-black hover:text-purple-500 transition-colors"
                >
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
