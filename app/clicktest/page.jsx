"use client";

export default function ClickTest() {
  function hardNav() {
    if (typeof window !== "undefined") window.location.assign("/login");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Click Test</h1>

      {/* 1) Plain anchor (no JS) */}
      <p>
        <a href="/login" style={{ textDecoration: "underline" }}>
          Anchor → /login
        </a>
      </p>

      {/* 2) Button with JS hard navigation */}
      <p style={{ marginTop: 12 }}>
        <button onClick={hardNav} style={{ padding: "8px 12px" }}>
          JS button → /login
        </button>
      </p>

      {/* 3) Plain HTML form submit */}
      <p style={{ marginTop: 12 }}>
        <form action="/login" method="get">
          <button type="submit" style={{ padding: "8px 12px" }}>
            Form submit → /login
          </button>
        </form>
      </p>

      {/* Force pointer events ON for everything */}
      <style jsx global>{`
        body * { pointer-events: auto !important; }
      `}</style>
    </div>
  );
}
