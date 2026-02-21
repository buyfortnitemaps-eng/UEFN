import "./globals.css";
import Navbar from "./shared/navber/page";
import Footer from "./shared/footer/page";
import { AuthProvider } from "../app/context/AuthContext";
import { CartProvider } from "./lib/CartContext";

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
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
