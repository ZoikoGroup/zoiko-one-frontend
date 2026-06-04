import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-md content-center">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Zoiko One</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Enterprise Login</h1>
          <p className="mt-2 text-sm text-slate-600">Tenant-aware access for platform governance, audit, and operations.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
