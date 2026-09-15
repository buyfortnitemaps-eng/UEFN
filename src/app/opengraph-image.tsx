import { ImageResponse } from "next/og";

export const alt = "UEFNMAP — Fortnite map templates and Verse scripts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "space-between", padding: 70, background: "linear-gradient(125deg, #10101b, #351264)", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: 5, color: "#c4b5fd" }}>UEFNMAP</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 72, lineHeight: 1.1, fontWeight: 800 }}>Build your next Fortnite island.</div>
        <div style={{ fontSize: 30, color: "#ddd6fe" }}>Map templates · Verse scripts · Custom development</div>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#c4b5fd" }}>uefnmap.com</div>
    </div>, size,
  );
}
