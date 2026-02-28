/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useCart } from "../lib/CartContext";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../../../firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { initializePaddle } from "@paddle/paddle-js";

export default function CartPage() {
    const { cart, removeFromCart, setCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [paddle, setPaddle] = useState(null);
    const router = useRouter();

    const subtotal = cart.reduce((acc, item) => {
        const itemPrice = item.isDiscount ? item.discountPrice : item.price;
        return acc + (itemPrice || 0);
    }, 0);
    const total = subtotal;

// ১. Paddle ইনিশিয়ালাইজ করা
useEffect(() => {
    initializePaddle({
        environment: 'sandbox',
        token: "test_1a4ec1f9df524f5570405eeb210",
        eventCallback: async (event) => {
            // পেমেন্ট সফল হওয়ার সাথে সাথে
            if (event.name === "checkout.completed") {
                
                // 🔥 ১. সবচাইতে পাওয়ারফুল ক্লোজ মেথড (ম্যানুয়ালি Paddle ক্লোজ করা)
                if (window.Paddle) {
                    window.Paddle.Checkout.close();
                }

                // 🔥 ২. যদি উপরের মেথড কোনো কারণে মিস হয়, তবে DOM থেকে ফ্রেম রিমুভ করা
                const paddleOverlay = document.querySelector('.paddle-checkout-overlay');
                if (paddleOverlay) {
                    paddleOverlay.remove();
                    document.body.style.overflow = 'auto'; // স্ক্রল ব্যাক করা
                }

                setLoading(true);
                try {
                    // ৩. ডাটাবেসে সেভ এবং কার্ট ক্লিয়ার লজিক
                    await handleOrderDatabaseStore(event.data);

                    const currentUser = auth.currentUser;
                    const token = await currentUser?.getIdToken();
                    
                    if (token) {
                        await fetch("https://uefn-maps-server.vercel.app/api/v1/cart/clear-cart", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({ products: [] })
                        });
                    }

                    // ৪. লোকাল স্টেট এবং রিডাইরেক্ট
                    setCart([]);
                    localStorage.removeItem("uefn_cart");
                    router.push("/my-assets");

                } catch (err) {
                    console.error("Cart Clear Error:", err);
                } finally {
                    setLoading(false);
                }
            }

            // যদি ইউজার পপ-আপটি ম্যানুয়ালি বন্ধ করে দেয়
            if (event.name === "checkout.closed") {
                setLoading(false);
            }
        }
    }).then((paddleInstance) => {
        if (paddleInstance) setPaddle(paddleInstance);
    });
}, [cart, router]); // router এবং cart ডিপেন্ডেন্সি যোগ করুন

 const handleOrderDatabaseStore = async (paymentData) => {
    try {
        const currentUser = auth.currentUser;
        const token = await currentUser?.getIdToken();

        // স্কিমা অনুযায়ী ডাটা ফরম্যাট করা
        const formattedProducts = cart.map(item => ({
            productId: item._id, // আপনার মডেলে productId হিসেবে আছে
            priceId: item.paddlePriceId || "manual_price" 
        }));

        await fetch("https://uefn-maps-server.vercel.app/api/v1/orders/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                products: formattedProducts, 
                transactionId: paymentData.id,
                orderId: paymentData.id
            })
        });
    } catch (err) {
        console.error("Database store error:", err);
    }
};
    // ২. চেকআউট হ্যান্ডলার
    const handleCheckout = async () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert("Please login first to proceed with the checkout.");
            return;
        }

        if (!paddle) {
            alert("Paddle is still loading. Please wait a moment.");
            return;
        }

        setLoading(true);

        try {
            // ব্যাকএন্ডে ট্রানজেকশন ক্রিয়েট করা
            const res = await fetch("https://uefn-maps-server.vercel.app/api/paddle/create-transaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        priceId: item.paddlePriceId,
                        quantity: 1
                    })),
                    email: currentUser.email
                })
            });

            const responseData = await res.json();

            if (!res.ok) {
                console.error("Backend Error Detail:", responseData);
                throw new Error(responseData.error || "Failed to create transaction");
            }

            // ৩. Paddle Checkout ওপেন করা (ট্রানজেকশন আইডি দিয়ে)
            paddle.Checkout.open({
                transactionId: responseData.data.id,
                settings: {
                    displayMode: "overlay",
                    theme: "dark",
                    locale: "en"
                }
            });

        } catch (error) {
            console.error("Full Checkout Error:", error);
            alert(error.message || "An error occurred during checkout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-40 px-4 sm:px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/20 blur-[180px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-card-bg border border-border-color rounded-2xl text-purple-500">
                            <ShoppingBag size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter">Your Cart</h1>
                            <p className="text-muted-foreground text-sm">{cart.length} asset{cart.length !== 1 ? 's' : ''} ready for deployment</p>
                        </div>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="max-w-3xl mx-auto text-center py-28 border border-dashed border-border-color rounded-3xl backdrop-blur-sm">
                        <ShoppingBag size={42} className="mx-auto mb-5 text-purple-500 opacity-30" />
                        <p className="text-muted-foreground text-lg mb-6 italic">Your cart is empty. Start collecting powerful assets.</p>
                        <Link href="/marketplace">
                            <button className="bg-purple-600 hover:bg-purple-500 px-10 py-3 rounded-xl font-black uppercase tracking-widest transition-all">Browse Shop</button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div key={item._id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-4 bg-card-bg border border-border-color p-4 rounded-3xl group hover:border-purple-500/50 transition-all">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                                            <img src={item.image?.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg truncate tracking-tight">{item.title}</h3>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Provider: {item.seller?.name}</p>
                                            <div className="mt-2 text-purple-400 font-black text-xl italic">${item.isDiscount ? item.discountPrice : item.price}</div>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all active:scale-90">
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="lg:block">
                            <div className="sticky top-28 bg-card-bg border border-border-color p-8 rounded-[2.5rem] shadow-xl backdrop-blur-md">
                                <h2 className="font-black text-xs mb-8 uppercase tracking-[0.3em] text-muted-foreground">Order Summary</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-bold uppercase">Subtotal</span>
                                        <span className="font-black">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-border-color pt-6">
                                        <span className="text-xl font-black uppercase italic">Total</span>
                                        <span className="text-3xl font-black text-purple-500 italic">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className={`w-full bg-purple-600 hover:bg-purple-500 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-600/20 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Secure Checkout"}
                                    {!loading && <ArrowRight size={20} />}
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground opacity-50">
                                    <ShieldCheck size={14} className="text-green-500" />
                                    Powered by Paddle • Secure Encryption
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}