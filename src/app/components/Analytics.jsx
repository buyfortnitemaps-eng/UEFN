"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { ANALYTICS_ID, CONSENT_KEY, publicPath, trackPageView, trackWebVital } from "../lib/analytics.mjs";

export default function Analytics() {
  const pathname = usePathname();
  const [choice, setChoice] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useReportWebVitals(trackWebVital);

  useEffect(() => {
    if (!ANALYTICS_ID) return;
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      // Browser storage is external state; read it after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChoice(saved === "accepted" || saved === "rejected" ? saved : "unset");
    } catch { setChoice("unset"); }
  }, []);

  useEffect(() => {
    if (!ANALYTICS_ID) return;
    window[`ga-disable-${ANALYTICS_ID}`] = choice !== "accepted" || !publicPath(pathname);
    if (choice !== "accepted" || !publicPath(pathname)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    if (!window.uefnmapAnalyticsInitialized) {
      window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      window.gtag("js", new Date());
      window.gtag("config", ANALYTICS_ID, { send_page_view: false, allow_google_signals: false,
        allow_ad_personalization_signals: false, page_location: `${window.location.origin}${publicPath(pathname)}`, page_referrer: "" });
      window.uefnmapAnalyticsInitialized = true;
    } else window.gtag("consent", "update", { analytics_storage: "granted" });
    trackPageView(pathname);
    window.dispatchEvent(new Event("uefnmap-analytics-ready"));
  }, [choice, pathname]);

  function choose(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { return; }
    if (value !== "accepted" && window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
    setChoice(value);
  }

  if (!ANALYTICS_ID || !publicPath(pathname) || !choice) return null;
  return <>
    {choice === "accepted" && <Script src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`} strategy="afterInteractive" onLoad={() => setLoaded(true)} />}
    {choice === "unset" ? <section aria-label="Analytics preferences" className="fixed bottom-4 left-4 right-4 z-[100] max-w-lg rounded-2xl border border-purple-400 bg-gray-950 p-5 text-white shadow-xl">
      <p className="text-sm mb-4">Allow optional analytics to help us improve the store? Shopping works with either choice.</p>
      <div className="flex gap-3">
        <button className="rounded-lg border border-gray-400 px-4 py-2" onClick={() => choose("rejected")}>No thanks</button>
        <button className="rounded-lg bg-purple-600 px-4 py-2" onClick={() => choose("accepted")}>Allow analytics</button>
      </div>
    </section> : <button className="fixed bottom-2 left-2 z-50 rounded-lg bg-gray-950 px-3 py-2 text-xs text-white border border-gray-600" onClick={() => choose("unset")} data-analytics-loaded={loaded}>Analytics preferences</button>}
  </>;
}
