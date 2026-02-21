import { logOut } from "../lib/firebaseActions";

export const handleSignOut = async (clearCart, router) => {
  try {
    await logOut();
    localStorage.removeItem("uefn_cart");
    if (clearCart) clearCart(); // এখান থেকে পাস করা ফাংশনটি কল হবে
    router.push("/auth/login");
  } catch (err) {
    console.error("Logout failed", err);
  }
};
