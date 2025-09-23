"use client";
import React from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Page() {
  const [email, setEmail] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setEmail(data?.user?.email ?? null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const goLogin = (e) => {
    e?.preventDefault?.();
    if (typeof window !== "undefined") window.location.assign("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-[9999] bg-white/80 backdrop-blur border-b border-gray-100"
              style={{ position: "sticky" }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-semibold">Landlord Toolkit</div>

          <div className="flex items-center gap-2" style={{ pointerEvents: "auto" }}>
            {email ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-600">{email}</span>
                <a
                  href="/logout"
                  className="px-3 py-1.5 rounded-xl text-sm border border-gray-300 hover:bg-gray-50"
                >
                  Log out
                </a>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={goLogin}
                  className="px-3 py-1.5 rounded-xl text-sm border border-gray-300 hover:bg-gray-50"
                >
                  Log in
                </a>
                <a
                  href="/login"
                  onClick={goLogin}
                  className="px-3 py-1.5 rounded-xl text-sm bg-black text-white hover:opacity-90"
                >
                  Start free
                </a>
              </>
            )}
          </div>
        </div>

        {/* Safety net: ensure nothing blocks clicks on header. Remove later if you want. */}
        <style jsx global>{`
          header, header * { pointer-events: auto !important; }
        `}</style>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-2">Home</h1>
        <p className="text-sm text-gray-600">
          Use the buttons in the header to go to the login page. After signing in, your email will appear here.
        </p>
        <p className="mt-4 text-sm">
          Quick links: <a className="underline" href="/login" onClick={goLogin}>/login</a> •{" "}
          <a className="underline" href="/logout">/logout</a>
        </p>
      </main>
    </div>
  );
}
