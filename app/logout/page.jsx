"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      try { await supabase.auth.signOut(); }
      finally {
        if (typeof window !== "undefined") window.location.assign("/login");
      }
    })();
  }, []);
  return <p style={{ padding: 16 }}>Signing you out…</p>;
}
