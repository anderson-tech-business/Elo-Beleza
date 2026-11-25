"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { professionals } from "@/data/demo";
import { setSession } from "@/lib/store";
import type { Role } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("admin");
  const [proId, setProId] = useState(professionals[0].id);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main id="conteudo" tabIndex={-1} className="focus:outline-none flex min-h-[calc(100vh-40px)] items-center justify-center px-4 py-10">
      <form
        className="card w-full max-w-sm p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          setSession(role === "admin" ? { role } : { role, professionalId: proId });
          router.push("/admin/agenda");
        }}
      >
        <Logo />
        <h1 className="mt-6 font-serif text-2xl font-semibold">Área interna</h1>
        <p className="mt-1 text-sm text-muted">Login simulado: qualquer e-mail e senha funcionam.</p>

        <fieldset className="mt-6">
          <legend className="label">Entrar como</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["admin", "pro"] as Role[]).map((r) => (
              <label
                key={r}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-dark ${role === r ? "border-primary-dark bg-primary-soft text-primary-dark" : "border-field"}`}
              >
                <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                {r === "admin" ? "Administradora" : "Profissional"}
              </label>
            ))}
          </div>
        </fieldset>

        {role === "pro" && (
          <div className="mt-4">
            <label htmlFor="pro" className="label">Profissional</label>
            <select id="pro" className="input" value={proId} onChange={(e) => setProId(e.target.value)}>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="email" className="label">E-mail</label>
          <input id="email" type="email" autoComplete="username" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="label">Senha</label>
          <input id="password" type="password" autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary mt-6 w-full">Entrar</button>
      </form>
    </main>
  );
}
