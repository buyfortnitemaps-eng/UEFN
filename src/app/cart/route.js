import { DISCORD_INVITE_URL } from "../lib/community.mjs";

export function GET() {
  return Response.redirect(DISCORD_INVITE_URL, 307);
}
