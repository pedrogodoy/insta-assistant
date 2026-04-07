"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const tons = ["Inspirador", "Educativo", "Divertido", "Direto ao ponto"];

export default function PostPage() {
  const [descricao, setDescricao] = useState("");
  const [tom, setTom] = useState("Inspirador");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function gerar() {
    if (!descricao.trim()) return;
    setLoading(true);
    setResultado("");
    const res = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descricao, tom }),
    });
    const text = await res.text();
    setResultado(text);
    setLoading(false);
  }

  async function copiar() {
    await navigator.clipboard.writeText(resultado);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Módulo</p>
        <h1 className="text-2xl font-bold text-white">✍️ Post + Legenda</h1>
        <p className="text-zinc-400 text-sm mt-1">Descreva o post e escolha o tom da legenda.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Tom</label>
          <div className="flex flex-wrap gap-2">
            {tons.map((t) => (
              <button
                key={t}
                onClick={() => setTom(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tom === t
                    ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/20"
                    : "bg-zinc-900 text-zinc-400 border border-white/8 hover:border-white/20 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Descrição</label>
          <Textarea
            placeholder="Ex: foto na academia, leg day concluído..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="bg-zinc-900 border-white/8 resize-none focus:border-pink-500/50 transition-colors"
          />
        </div>

        <Button
          onClick={gerar}
          disabled={loading || !descricao.trim()}
          className="bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:opacity-90 transition-opacity disabled:opacity-40 border-0"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Gerando...
            </span>
          ) : (
            "Gerar Legenda"
          )}
        </Button>
      </div>

      {resultado && (
        <div className="rounded-xl border border-white/8 bg-zinc-900/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Legenda gerada</span>
            <button
              onClick={copiar}
              className="text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              {copied ? "✓ Copiado" : "Copiar"}
            </button>
          </div>
          <div className="p-4">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{resultado}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
