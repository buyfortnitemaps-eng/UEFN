import { redirect } from "next/navigation";
import { DISCORD_INVITE_URL } from "../lib/community.mjs";
export default function CartPage() { redirect(DISCORD_INVITE_URL); }
