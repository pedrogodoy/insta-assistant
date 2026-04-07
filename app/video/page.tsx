"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const velocidades = ["0.25x", "0.5x", "0.75x", "1x", "1.5x", "2x", "4x"];
const formatos = [
  { value: "original", label: "Original" },
  { value: "quadrado", label: "1:1 Quadrado" },
  { value: "reels", label: "9:16 Reels" },
];
const rotacoes = [
  { value: "", label: "Sem rotação" },
  { value: "90cw", label: "90° →" },
  { value: "90ccw", label: "90° ←" },
  { value: "180", label: "180°" },
];

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg shadow-orange-500/20"
          : "bg-zinc-900 text-zinc-400 border border-white/8 hover:border-white/20 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function VideoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [modoIA, setModoIA] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [velocidade, setVelocidade] = useState("1x");
  const [formato, setFormato] = useState("original");
  const [rotacao, setRotacao] = useState("");
  const [semAudio, setSemAudio] = useState(false);
  const [legendas, setLegendas] = useState(false);
  const [status, setStatus] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function processar() {
    if (!file) return;
    setStatus("Processando...");
    setOutputUrl("");

    const form = new FormData();
    form.append("video", file);

    if (modoIA && descricao.trim()) {
      form.append("descricao", descricao);
    } else {
      if (inicio) form.append("inicio", inicio);
      if (fim) form.append("fim", fim);
      form.append("velocidade", velocidade.replace("x", ""));
      form.append("formato", formato);
      form.append("rotacao", rotacao);
      form.append("semAudio", String(semAudio));
      form.append("legendas", String(legendas));
    }

    const res = await fetch("/api/video", { method: "POST", body: form });
    if (!res.ok) {
      setStatus(`Erro: ${await res.text()}`);
      return;
    }
    setOutputUrl(URL.createObjectURL(await res.blob()));
    setStatus("Pronto!");
  }

  const processando = status === "Processando...";

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Módulo</p>
        <h1 className="text-2xl font-bold text-white">✂️ Edição de Vídeo</h1>
        <p className="text-zinc-400 text-sm mt-1">Corte, formate, ajuste velocidade e mais.</p>
      </div>

      <div className="space-y-5">
        {/* Toggle modo */}
        <div className="flex gap-1 p-1 bg-zinc-900 border border-white/8 rounded-xl w-fit">
          <button
            onClick={() => setModoIA(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !modoIA ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Controles manuais
          </button>
          <button
            onClick={() => setModoIA(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              modoIA
                ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            ✨ Descrever com IA
          </button>
        </div>

        {/* Descrição IA */}
        {modoIA && (
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
              Descreva as edições
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              placeholder={`Ex: corta do segundo 10 ao 40, coloca em formato Reels, adiciona texto "Bom dia!" grande no topo nos primeiros 3 segundos, velocidade 1.5x`}
              className="w-full bg-zinc-900 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
            />
            <p className="text-xs text-zinc-600 mt-1.5">
              O Claude interpreta e aplica: corte, velocidade, formato, rotação, texto overlay e mais.
            </p>
          </div>
        )}

        {/* Upload */}
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            file ? "border-orange-500/40 bg-orange-500/5" : "border-white/10 hover:border-white/20"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          {file ? (
            <div>
              <p className="text-sm text-orange-300 font-medium">{file.name}</p>
              <p className="text-xs text-zinc-500 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl mb-2">🎥</p>
              <p className="text-sm text-zinc-400">Clique para selecionar um vídeo</p>
              <p className="text-xs text-zinc-600 mt-1">MP4, MOV</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Controles manuais */}
        {!modoIA && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Corte</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-600 block mb-1">Início</label>
                  <input
                    value={inicio}
                    onChange={(e) => setInicio(e.target.value)}
                    placeholder="00:00"
                    className="w-full bg-zinc-900 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-600 block mb-1">Fim</label>
                  <input
                    value={fim}
                    onChange={(e) => setFim(e.target.value)}
                    placeholder="fim"
                    className="w-full bg-zinc-900 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Velocidade</label>
              <div className="flex flex-wrap gap-2">
                {velocidades.map((v) => (
                  <PillButton key={v} active={velocidade === v} onClick={() => setVelocidade(v)}>
                    {v}
                  </PillButton>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Formato</label>
              <div className="flex flex-wrap gap-2">
                {formatos.map(({ value, label }) => (
                  <PillButton key={value} active={formato === value} onClick={() => setFormato(value)}>
                    {label}
                  </PillButton>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Rotação</label>
              <div className="flex flex-wrap gap-2">
                {rotacoes.map(({ value, label }) => (
                  <PillButton key={value} active={rotacao === value} onClick={() => setRotacao(value)}>
                    {label}
                  </PillButton>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <PillButton active={semAudio} onClick={() => setSemAudio(!semAudio)}>
                {semAudio ? "✓ Sem áudio" : "Sem áudio"}
              </PillButton>
              <PillButton active={legendas} onClick={() => setLegendas(!legendas)}>
                {legendas ? "✓ Legendas (Whisper)" : "Legendas (Whisper)"}
              </PillButton>
            </div>
          </div>
        )}

        <Button
          onClick={processar}
          disabled={!file || processando || (modoIA && !descricao.trim())}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:opacity-90 transition-opacity disabled:opacity-40 border-0"
        >
          {processando ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              {modoIA ? "Analisando e processando..." : "Processando..."}
            </span>
          ) : (
            modoIA ? "✨ Processar com IA" : "Processar Vídeo"
          )}
        </Button>

        {status && !processando && (
          <p className={`text-sm ${status.startsWith("Erro") ? "text-red-400" : "text-zinc-400"}`}>{status}</p>
        )}
      </div>

      {outputUrl && (
        <div className="rounded-xl border border-white/8 bg-zinc-900/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Vídeo processado</span>
          </div>
          <div className="p-4 space-y-3">
            <video src={outputUrl} controls className="w-full rounded-lg" />
            <a
              href={outputUrl}
              download="video-editado.mp4"
              className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              ↓ Baixar vídeo
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
