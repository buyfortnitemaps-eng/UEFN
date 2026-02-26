/* eslint-disable @next/next/no-img-element */
"use client";
import { useCart } from "../lib/CartContext";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../../../firebase"; // নিশ্চিত করুন আপনার ফায়ারবেস কনফিগ পাথ ঠিক আছে
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cart, removeFromCart, setCart } = useCart();
    const [loading, setLoading] = useState(false); // লোডিং স্টেট
    const router = useRouter();

    const subtotal = cart.reduce((acc, item) => acc + (item.price || 0), 0);
    const total = subtotal;

    const handleCheckout = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                alert("Please login to checkout");
                setLoading(false);
                return;
            }

            const token = await currentUser.getIdToken();
            const response = await fetch(`https://uefn-maps-server.vercel.app/api/v1/orders/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ products: cart })
            });

            const data = await response.json();
            router.push("/my-assets");

            if (data.success) {
                setCart([]);
                localStorage.removeItem("uefn_cart");
                // alert("Purchase Successful! Your assets are now in your inventory.");
            } else {
                alert(data.message || "Checkout failed");
                window.location.reload();
            }
        } catch (error) {
            console.error("Checkout failed", error);
            alert("An error occurred during checkout. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-40 px-4 sm:px-6">
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
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-background rounded-2xl text-purple-500">
                            <ShoppingBag size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Your Vault</h1>
                            <p className="text-forground text-sm">{cart.length} asset{cart.length !== 1 && "s"} ready for deployment</p>
                        </div>
                    </div>
                    <Link href="/marketplace">
                        <button className="hidden sm:block text-sm border border-white/5 px-5 py-2 rounded-xl hover:border-purple-500/40 hover:text-purple-400 transition">
                            Continue Browsing
                        </button>
                    </Link>
                </div>
            </div>

            {cart.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto text-center py-28 border border-dashed border-border-color rounded-3xl">
                    <ShoppingBag size={42} className="mx-auto mb-5 text-purple-500" />
                    <p className="text-forground text-lg mb-6">Your vault is empty. Start collecting powerful assets.</p>
                    <Link href="/marketplace">
                        <button className="bg-purple-600 hover:bg-purple-500 px-10 py-3 rounded-xl font-bold transition">Browse Shope</button>
                    </Link>
                </motion.div>
            ) : (
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div key={item._id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="group flex items-center gap-4 bg-white/4 border border-white/5 hover:border-purple-500/30 p-4 rounded-2xl transition-all">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                        <img src={item.image?.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-foreground truncate">{item.title}</h3>
                                        <p className="text-xs text-forground mt-1">Seller: {item.seller?.name}</p>
                                        <div className="mt-2 text-purple-400 font-black text-lg">${item.price}</div>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className="opacity-60 hover:opacity-100 hover:bg-red-500/20 text-red-400 p-3 rounded-xl transition">
                                        <Trash2 size={18} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="hidden lg:block">
                        <div className="sticky top-28 bg-white/4 border border-white/5 p-8 rounded-3xl">
                            <h2 className="font-bold text-lg mb-8 uppercase tracking-widest">Checkout</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-forground">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="border-t border-border-color pt-6 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">Total</span>
                                    <span className="text-3xl font-black text-purple-500">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* ডেক্সটপ বাটন ফিক্স: onClick={handleCheckout} যোগ করা হয়েছে */}
                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className={`w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition shadow-lg shadow-purple-600/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? "Processing..." : "Secure Checkout"}
                                <ArrowRight size={18} />
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <ShieldCheck size={14} className="text-green-500" />
                                Secured Paddle Payment
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MOBILE CHECKOUT BAR */}
            {cart.length > 0 && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border-color p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-forground">Total</p>
                        <p className="text-xl font-black text-purple-400">${total.toFixed(2)}</p>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className={`bg-purple-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? "..." : "Checkout"}
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}