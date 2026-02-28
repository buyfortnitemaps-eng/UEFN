/* eslint-disable react/no-unescaped-entities */
"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Download,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const HomePage = () => {
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
      const res = await fetch(
        "https://uefn-maps-server.vercel.app/api/v1/contacts/send-message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
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
    <div className="min-h-screen text-foreground bg-background overflow-auto">
      {/* --- WHY US SECTION --- */}
      <section className="py-20 border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
              <Zap size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">Instant Delivery</h4>
            <p className="text-gray-500">
              Get your download link on your dashboard immediately after
              checkout.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
              <Download size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">
              {" "}
              Optimized for Publishing
            </h4>
            <p className="text-gray-500">
              Clean projects that are easy to customize and publish in UEFN
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">Paddle Secured</h4>
            <p className="text-gray-500">
              International payments handled safely with full tax compliance.
            </p>
          </div>
        </div>
      </section>

      {/* testimonial section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
          >
            Loved by <span className="text-purple-500">UEFN</span> Creators
          </motion.h2>
          <p className="text-forground max-w-lg mx-auto leading-relaxed">
            Don't just take our word for it. Join thousands of satisfied
            developers building the future of Fortnite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              name: "PlazuFN",
              comment:
                "Dropped the Arena template into UEFN and had a playable map in under an hour. Clean setup and easy to customize.",
              purchased: "Purchased: Arena Map Template",
              avatar: "P",
            },
            {
              name: "NovaBuilds",
              comment:
                "Bought a premium map and requested a small bug fix. Support was quick and the Verse logic worked out of the box.",
              purchased: "Service: Bug Fix + Verse Support",
              avatar: "N",
            },
            {
              name: "KairoMaps",
              comment:
                "The files are organized and publish-ready. Saved me days of setup and debugging.",
              purchased: "Purchased: Premium Map",
              avatar: "K",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-8 bg-card-bg border border-white/5 rounded-[2.5rem] relative group overflow-hidden transition-all duration-300 shadow-xl shadow-purple-500/5 hover:shadow-purple-500/10"
            >
              {/* Hover Glow Accent */}
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Quote Icon */}
              <div className="text-purple-500 mb-4 text-5xl font-serif opacity-30 italic leading-none">
                “
              </div>

              {/* Comment */}
              <p className="text-muted-foreground mb-8 leading-relaxed relative z-10 italic text-sm md:text-base">
                "{testimonial.comment}"
              </p>

              {/* User Info & Rating */}
              <div className="flex flex-col gap-4 relative z-10 border-t border-border-color pt-6 mt-auto">
                <div className="flex items-center gap-4">
                  {/* Avatar with Gradient */}
                  <div className="w-12 h-12 bg-linear-to-tr from-purple-600 to-fuchsia-500 rounded-2xl flex items-center justify-center font-black text-white shadow-lg text-lg transform group-hover:rotate-6 transition-transform">
                    {testimonial.avatar}
                  </div>

                  <div className="text-left overflow-hidden">
                    <p className="font-black text-foreground truncate">
                      {testimonial.name}
                    </p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, star) => (
                        <span
                          key={star}
                          className="text-yellow-500 text-[10px]"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Purchased Badge */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-purple-500/10">
                    {testimonial.purchased}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CTA Section (Replacement 4) --- */}
      <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* --- Contact Hidden SEO --- */}
            <section className="sr-only">
              <h2>Contact UEFN Creator for Map Commissions</h2>
              <p>
                Get in touch for custom Fortnite map services, UEFN development
                help, and specialized map design requests. We provide the best
                Fortnite map support and UEFN creator services.
              </p>
              <ul>
                <li>Hire UEFN developer for premium map projects</li>
                <li>Support for purchased UEFN assets and Verse scripts</li>
                <li>Request custom Fortnite Creative islands and game modes</li>
                <li>Join our Discord for UEFN map design collaboration</li>
              </ul>
            </section>

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
                    value: "webuefnmap@gmail.com",
                  },
                  {
                    icon: <Phone className="text-purple-500" />,
                    label: "Phone",
                    value: "+880 1953 558205",
                  },
                  {
                    icon: <MapPin className="text-purple-500" />,
                    label: "Office",
                    value: "Dhaka, Bangladesh",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-background p-6 rounded-3xl border border-border-color"
                  >
                    <div className="p-3 bg-purple-500/10 rounded-2xl">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {item.label}
                      </p>
                      <p className="text-foreground font-bold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-border-color p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-widest">
                      Name
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-background border border-border-color rounded-2xl py-4 px-6 focus:border-purple-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-widest">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-background border border-border-color rounded-2xl py-4 px-6 focus:border-purple-500 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-widest">
                    Phone
                  </label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-background border border-border-color rounded-2xl py-4 px-6 focus:border-purple-500 outline-none transition-all"
                    placeholder="+1..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-widest">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-background border border-border-color rounded-2xl py-4 px-6 focus:border-purple-500 outline-none transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-foreground rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-500/20 disabled:opacity-50"
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
                    className="absolute inset-0 bg-background/40 z-20 flex flex-col items-center justify-center p-8 text-center"
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

      {/* call to action */}
      <section className="py-24 px-6 bg-transparent relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto relative group"
        >
          {/* Background Glow Aura - Dynamic based on theme */}
          <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-fuchsia-500 to-blue-600 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse" />

          <div className="relative bg-card-bg border border-border-color backdrop-blur-3xl rounded-[3rem] p-10 md:p-24 text-center overflow-hidden shadow-2xl shadow-purple-500/5">
            {/* Decorative Floating Gradients */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-purple-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Badge Content */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              Get Started Today
            </div>

            <h2 className="text-4xl md:text-7xl font-black mb-8 text-foreground tracking-tighter leading-[1.1]">
              Ready to Build Your <br />
              <span className="bg-linear-to-r from-purple-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
                Dream Map?
              </span>
            </h2>

            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Join{" "}
              <span className="text-foreground font-black">
                2,100+ creators
              </span>{" "}
              who are using our premium UEFN assets to speed up their
              development and win more players.
            </p>

            <div className="flex flex-col items-center justify-center gap-6">
              <Link href={"/marketplace"}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-purple-600 text-white px-14 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-purple-600/30 overflow-hidden transition-all"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                  <span className="relative flex items-center gap-3">
                    Start Browsing Now <ChevronRight size={24} />
                  </span>
                </motion.button>
              </Link>

              <div className="flex items-center gap-3 text-muted-foreground font-bold text-xs uppercase tracking-widest opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                No credit card required to browse
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
