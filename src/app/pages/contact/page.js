/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, MapPin, CheckCircle } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("https://uefn-maps-server.vercel.app/api/v1/contacts/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
                Get in <span className="text-purple-500">Touch</span>
              </h1>
              <p className="text-gray-500 text-lg">
                Have a project in mind or need help with UEFN? Drop a message!
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <Mail className="text-purple-500" />,
                  label: "Email",
                  value: "support@uefnmaps.com",
                },
                {
                  icon: <Phone className="text-purple-500" />,
                  label: "Phone",
                  value: "+880 1234 567890",
                },
                {
                  icon: <MapPin className="text-purple-500" />,
                  label: "Office",
                  value: "Dhaka, Bangladesh",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10"
                >
                  <div className="p-3 bg-purple-500/10 rounded-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {item.label}
                    </p>
                    <p className="text-white font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Name
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-2xl py-4 px-6 focus:border-purple-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-2xl py-4 px-6 focus:border-purple-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Phone
                </label>
                <input
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-[#0a0a0b] border border-white/10 rounded-2xl py-4 px-6 focus:border-purple-500 outline-none transition-all"
                  placeholder="+880..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-[#0a0a0b] border border-white/10 rounded-2xl py-4 px-6 focus:border-purple-500 outline-none transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                disabled={isSubmitting}
                className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Success Message Overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 z-20 flex flex-col items-center justify-center p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500/20 p-4 rounded-full mb-4"
                  >
                    <CheckCircle size={50} className="text-green-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-gray-300">
                    We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
