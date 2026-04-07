"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const formats = ["Reels (60s)", "Reels (30s)", "Stories", "Carrossel narrado"];

export default function RoteiroPage() {
  const [tema, setTema] = useState("");
  const [formato, setFormato] = useState("Reels (60s)");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function gerar() {
    if (!tema.trim()) return;
    setLoading(true);
    setResultado("");
    const res = await fetch("/api/roteiro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tema, formato }),
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
        <h1 className="text-2xl font-bold text-white">🎬 Roteiro de Vídeo</h1>
        <p className="text-zinc-400 text-sm mt-1">Descreva o tema e escolha o formato do conteúdo.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Formato</label>
          <div className="flex flex-wrap gap-2">
            {formats.map((f) => (
              <button
                key={f}
                onClick={() => setFormato(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  formato === f
                    ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/20"
                    : "bg-zinc-900 text-zinc-400 border border-white/8 hover:border-white/20 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Tema</label>
          <Textarea
            placeholder="Ex: dicas de treino em casa para iniciantes..."
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            rows={4}
            className="bg-zinc-900 border-white/8 resize-none focus:border-violet-500/50 transition-colors"
          />
        </div>

        <Button
          onClick={gerar}
          disabled={loading || !tema.trim()}
          className="bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:opacity-90 transition-opacity disabled:opacity-40 border-0"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Gerando...
            </span>
          ) : (
            "Gerar Roteiro"
          )}
        </Button>
      </div>

      {resultado && (
        <div className="rounded-xl border border-white/8 bg-zinc-900/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Roteiro gerado</span>
            <button
              onClick={copiar}
              className="text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              {copied ? "✓ Copiado" : "Copiar"}
            </button>
          </div>
          <div className="p-4">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-zinc-200">{resultado}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
