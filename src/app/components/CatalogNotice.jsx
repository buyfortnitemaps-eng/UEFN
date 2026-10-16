export default function CatalogNotice({ catalog, className = "" }) {
  if (catalog?.source !== "saved") return null;
  const date = catalog.capturedAt ? new Date(catalog.capturedAt) : null;
  const label = date && Number.isFinite(date.getTime())
    ? date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    : null;
  return (
    <p role="status" className={`mx-auto max-w-7xl rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground ${className}`}>
      {catalog.reason === "cache"
        ? `Showing the last verified catalog details${label ? ` from ${label}` : ""} while checking for updates.`
        : `Catalog updates are temporarily unavailable. Showing saved details${label ? ` from ${label}` : ""}.`}
      {" "}Please confirm current availability and pricing with our team.
    </p>
  );
}
