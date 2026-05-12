"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { authCopy } from "@/lib/auth-copy";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const copy = authCopy[lang];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-5">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-8 text-center backdrop-blur-2xl">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100">
            {loading ? <Loader2 className="size-5 animate-spin" /> : <LockKeyhole className="size-5" />}
          </div>
          <p className="font-bold text-white">
            {loading ? copy.loading : copy.protectedRedirect}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
