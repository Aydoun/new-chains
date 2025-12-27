"use client";

import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Manrope } from "next/font/google";
import { signIn, useSession } from "next-auth/react";
import { translate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function LoginClient({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSignIn = () => {
    void signIn("google", { callbackUrl });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSignIn();
  };

  const isLoading = status === "loading";

  return (
    <main
      className={cn(
        "relative min-h-screen overflow-hidden bg-[#0f172a] text-white",
        manrope.className
      )}
    >
      <div className="pointer-events-none absolute inset-0 login-animated-bg" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#136dec]/30 login-blob animate-[login-float_12s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-20 bottom-[-120px] h-[360px] w-[360px] rounded-full bg-indigo-600/20 login-blob animate-[login-float_11s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#136dec] to-indigo-600 shadow-[0_20px_50px_-12px_rgba(19,109,236,0.6)] ring-1 ring-white/10">
            <span className="text-3xl font-extrabold text-white">{`{}`}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Sequences
          </h1>
        </div>

        <div className="w-full max-w-[480px] rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-10">
          <div className="mb-6 flex flex-col gap-2 text-center">
            <h2 className="text-xl font-semibold sm:text-2xl">
              {translate("auth.welcome")}
            </h2>
            <p className="text-sm text-slate-400">
              {translate("auth.subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isLoading}
              className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-lg bg-white px-5 text-slate-900 shadow-lg shadow-black/10 transition-all duration-150 hover:scale-[1.01] hover:bg-slate-50 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              data-testid="google-sign-in"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-base font-semibold leading-normal tracking-[0.015em]">
                {translate("auth.cta.google")}
              </span>
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10" />
              <span className="mx-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {translate("auth.continueWithEmail")}
              </span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-slate-200"
                  htmlFor="email"
                >
                  {translate("auth.emailLabel")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={translate("auth.emailPlaceholder")}
                  className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder:text-slate-500 focus:border-[#136dec] focus:outline-none focus:ring-2 focus:ring-[#136dec]/60"
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-slate-200"
                  htmlFor="password"
                >
                  {translate("auth.passwordLabel")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={translate("auth.passwordPlaceholder")}
                  className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder:text-slate-500 focus:border-[#136dec] focus:outline-none focus:ring-2 focus:ring-[#136dec]/60"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#136dec] text-base font-semibold tracking-[0.01em] text-white transition-all duration-150 hover:bg-[#2d7ff0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#136dec] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading
                  ? translate("common.loading")
                  : translate("auth.cta.signIn")}
              </button>
            </form>

            <div className="flex justify-center">
              <a
                className="text-sm font-medium text-[#5fa5ff] transition-colors hover:text-white"
                href="#"
              >
                {translate("auth.forgotPassword")}
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-8 flex flex-col gap-4 text-center text-sm text-slate-400">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a
              className="transition-colors hover:text-white"
              href="#"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </a>
            <span className="text-slate-600">•</span>
            <a
              className="transition-colors hover:text-white"
              href="#"
              aria-label="Terms of Service"
            >
              Terms of Service
            </a>
          </div>
          <p className="text-xs text-slate-500">
            © 2024 Sequences App. All rights reserved.
          </p>
        </footer>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-8 hidden lg:block">
        <div className="w-[240px] rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">
              {translate("auth.status.label")}: {translate("auth.status.operational")}
            </span>
          </div>
          <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-[#136dec]" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>CPU 24%</span>
            <span>MEM 42%</span>
          </div>
        </div>
      </div>
    </main>
  );
}
