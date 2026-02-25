"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, X } from "lucide-react";
import Link from "next/link";

const CartSuccessModal = ({ isOpen, onClose, productName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-background border border-white/5 p-8 rounded-3xl w-[90%] max-w-95 shadow-2xl text-center relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-background blur-3xl rounded-full" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-foreground transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="mb-6 flex justify-center">
              <div className="bg-green-500/20 p-4 rounded-full">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2">
              Added to Cart!
            </h3>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              <span className="text-purple-400 font-semibold">
                {productName}
              </span>{" "}
              has been successfully added to your shopping cart.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/cart"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-foreground rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-500/20"
              >
                Go to Checkout{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <button
                onClick={onClose}
                className="w-full py-3 bg-background hover:bg-white/10 text-gray-300 rounded-xl font-semibold transition-all border border-white/5"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartSuccessModal;