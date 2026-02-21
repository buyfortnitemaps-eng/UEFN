/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Gamepad2,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import {
  loginWithEmail,
  signInWithGoogle,
  resetPassword, // ইম্পোর্ট করুন
} from "../../lib/firebaseActions";
import { useAuth } from "../../context/AuthContext";
import { handleSignOut } from "../../utils/handleSIgnout";

const Login = () => {
  const { user, loading: authLoading, mongoUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false); // রিসেট লোডিং
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // সাকসেস মেসেজ
  const [formData, setFormData] = useState({ email: "", password: "" });

  // হ্যান্ডেল লগআউট


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await loginWithEmail(formData.email, formData.password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // পাসওয়ার্ড রিসেট লজিক
  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address first to reset password.");
      return;
    }

    setResetLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await resetPassword(formData.email);
      setSuccessMsg(
        "Password reset link sent to your email! Check your inbox and spam folder.",
      );
    } catch (err) {
      setError("Could not send reset email. Make sure the email is correct.");
      console.error(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      const firebaseUser = res.user;

      await fetch(
        "https://uefn-maps-server.vercel.app/api/v1/users/create-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            firebaseUid: firebaseUser.uid,
            image: firebaseUser.photoURL || "",
            role: "user",
          }),
        },
      );
    } catch (err) {
      setError("Google Sign-In failed.");
      console.error(err.message);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-6 py-20 relative overflow-hidden text-white">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/2 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/20">
              <Gamepad2 className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
              {user ? "Session" : "Welcome"}{" "}
              <span className="text-purple-500">
                {user ? "Active" : "Back"}
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-medium italic">
              {user
                ? `Logged in as ${user.email}`
                : "Ready to level up your UEFN assets?"}
            </p>
          </div>

          {user ? (
            /* --- সাইনআউট সেকশন --- */
            <div className="space-y-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center">
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  You are currently signed in. You can manage your assets or
                  switch to another account.
                </p>
                <div className="flex flex-col gap-3">
                  {user && mongoUser?.role === "user" && (
                    <Link
                      href="/assets"
                      className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition-all"
                    >
                      Go to Assets <ArrowRight size={18} />
                    </Link>
                  )}

                  {user && mongoUser?.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition-all"
                    >
                      Go to Admin Dashboard <ArrowRight size={18} />
                    </Link>
                  )}

                  <button
                    onClick={() => handleSignOut()}
                    className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* --- লগইন ফর্ম --- */
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center"
                >
                  {error}
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-xs font-bold text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle size={14} /> {successMsg}
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors"
                    size={20}
                  />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    placeholder="Email Address"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-[#0d0d0f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50 transition-all font-medium text-sm"
                  />
                </div>

                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors"
                    size={20}
                  />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-[#0d0d0f] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50 transition-all font-medium text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    disabled={resetLoading}
                    onClick={handleForgotPassword}
                    className="text-[10px] font-black text-gray-600 hover:text-purple-400 transition-colors uppercase tracking-widest disabled:opacity-50"
                  >
                    {resetLoading ? "Sending Link..." : "Forgot Password?"}
                  </button>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-purple-600 hover:text-white transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              <div className="flex items-center gap-4 my-8">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <div className="grid gap-4">
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 py-4 rounded-2xl transition-all font-bold text-sm text-white active:scale-95"
                >
                  <FaGoogle size={18} /> Google
                </button>
              </div>

              <p className="text-center mt-10 text-gray-500 text-sm font-medium">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-purple-500 font-bold hover:underline"
                >
                  Create for free
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
