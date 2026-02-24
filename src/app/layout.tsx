"use client";
import "./globals.css";
import Navbar from "./shared/navber/page";
import Footer from "./shared/footer/page";
import { AuthProvider } from "../app/context/AuthContext";
import { CartProvider } from "./lib/CartContext";
import ChatWidget from "./components/ChatWidget";
import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              <Navbar />
              <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                {children}
              </div>
              <ChatWidget />
              <Footer />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
