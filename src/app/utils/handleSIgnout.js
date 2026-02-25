import { logOut } from "../lib/firebaseActions";

export const handleSignOut = async (clearCart) => {
  try {
    await logOut();
    localStorage.removeItem("uefn_cart");
    if (clearCart) clearCart();
  } catch (err) {
    console.error("Logout failed", err);
  }
};
