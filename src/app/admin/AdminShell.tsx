"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { resetDemo, setSession, useSession } from "@/lib/store";
import { proById } from "@/lib/slots";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const isLogin = pathname === "/admin";

  useEffect(() => {
    if (!isLogin && session === null) router.replace("/admin");
  }, [isLogin, session, router]);

  if (isLogin) return <>{children}</>;
  if (!session) return <p className="p-8 text-muted">Carregando…</p>;

  const links = [
    { href: "/admin/agenda", label: "Agenda" },
    ...(session.role === "admin" ? [{ href: "/admin/dashboard", label: "Dashboard" }] : []),
    { href: "/admin/pacientes", label: "Pacientes" },
  ];
  const who = session.role === "admin" ? "Administradora" : proById(session.professionalId!).name;

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-6">
            <Logo href="/admin/agenda" small />
            <nav aria-label="Área interna" className="flex gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                  className={`btn-sm btn ${pathname.startsWith(l.href) ? "bg-primary-soft text-primary-dark" : "text-ink hover:bg-primary-soft"}`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-muted sm:inline">
              {who}
              {session.role === "pro" && " · Profissional"}
            </span>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => {
                if (confirm("Restaurar os dados originais do modelo? Agendamentos feitos no demo serão apagados.")) resetDemo();
              }}
            >
              Restaurar demo
            </button>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={() => {
                setSession(null);
                router.replace("/admin");
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main id="conteudo" className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
