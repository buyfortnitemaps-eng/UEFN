import { redirect } from "next/navigation";
import { DISCORD_INVITE_URL } from "../../lib/community.mjs";

export const metadata = { robots: { index: false, follow: false } };
export default function CheckoutPage() { redirect(DISCORD_INVITE_URL); }
