"use client";
import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <Auth supabaseClient={supabase} providers={[]} appearance={{ theme: ThemeSupa }} />
        <p className="text-xs text-gray-500 mt-3">
          Tip: Use the tabs above the form to switch between “Sign in” and “Sign up”.
        </p>
      </div>
    </main>
  );
}
