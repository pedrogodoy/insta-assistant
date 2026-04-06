"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VideoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
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
    if (inicio) form.append("inicio", inicio);
    if (fim) form.append("fim", fim);
    form.append("legendas", String(legendas));

    const res = await fetch("/api/video", { method: "POST", body: form });
    if (!res.ok) {
      const err = await res.text();
      setStatus(`Erro: ${err}`);
      return;
    }
    const blob = await res.blob();
    setOutputUrl(URL.createObjectURL(blob));
    setStatus("Pronto!");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">✂️ Edição de Vídeo</h1>
        <p className="text-zinc-400 text-sm mt-1">Faça cortes e adicione legendas automáticas.</p>
      </div>

      <div className="space-y-4">
        <div
          className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {file ? (
            <p className="text-sm text-zinc-300">{file.name}</p>
          ) : (
            <p className="text-sm text-zinc-500">Clique para selecionar um vídeo (MP4, MOV)</p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block">Início (ex: 00:10)</label>
            <input
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              placeholder="00:00"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block">Fim (ex: 01:30)</label>
            <input
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              placeholder="fim"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={legendas ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setLegendas(!legendas)}
          >
            {legendas ? "✓ Legendas automáticas" : "Legendas automáticas"}
          </Badge>
          <span className="text-xs text-zinc-500">(requer Whisper instalado)</span>
        </div>

        <Button onClick={processar} disabled={!file || status === "Processando..."}>
          {status === "Processando..." ? "Processando..." : "Processar Vídeo"}
        </Button>

        {status && status !== "Processando..." && (
          <p className="text-sm text-zinc-400">{status}</p>
        )}
      </div>

      {outputUrl && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-400">Vídeo processado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <video src={outputUrl} controls className="w-full rounded-md" />
            <a
              href={outputUrl}
              download="video-editado.mp4"
              className="text-sm text-blue-400 hover:underline"
            >
              Baixar vídeo
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
