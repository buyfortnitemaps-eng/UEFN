"use client";
import Navbar from "./shared/navber/page";
import Footer from "./shared/footer/page";
import { AuthProvider } from "../app/context/AuthContext";
import { CartProvider } from "./lib/CartContext";
import ChatWidget from "./components/ChatWidget";
import { ThemeProvider } from "next-themes";
import Analytics from "./components/Analytics";

export default function SiteProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              <Analytics />
              <Navbar />
                {children}
              <ChatWidget />
              <Footer />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
    </>
  );
}
