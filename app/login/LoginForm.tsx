"use client";

import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("LOGIN SUBMIT FIRED");

    setPending(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);

      const payload = {
        tenantSlug: formData.get("tenantSlug"),
        email: formData.get("email"),
        password: formData.get("password"),
      };

      console.log("Sending Login Request:", payload);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response Status:", response.status);

      const body = await response.json().catch(() => null);

      console.log("Response Body:", body);

      if (!response.ok) {
        setError(body?.error ?? "Unable to sign in.");
        setPending(false);
        return;
      }

      console.log("Login Successful");

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong while signing in.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Tenant
        <input
          name="tenantSlug"
          defaultValue="zoiko-one"
          className="h-11 rounded-md border border-slate-300 px-3 text-slate-950 outline-none focus:border-blue-600"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Email
        <input
          name="email"
          type="email"
          defaultValue="admin@zoiko.one"
          className="h-11 rounded-md border border-slate-300 px-3 text-slate-950 outline-none focus:border-blue-600"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Password
        <input
          name="password"
          type="password"
          placeholder="Enter password"
          className="h-11 rounded-md border border-slate-300 px-3 text-slate-950 outline-none focus:border-blue-600"
          required
        />
      </label>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        <LogIn className="h-4 w-4" />
        {pending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}