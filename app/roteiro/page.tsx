"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formats = ["Reels (60s)", "Reels (30s)", "Stories", "Carrossel narrado"];

export default function RoteiroPage() {
  const [tema, setTema] = useState("");
  const [formato, setFormato] = useState("Reels (60s)");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">🎬 Roteiro de Vídeo</h1>
        <p className="text-zinc-400 text-sm mt-1">Descreva o tema e escolha o formato.</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {formats.map((f) => (
            <Badge
              key={f}
              variant={formato === f ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFormato(f)}
            >
              {f}
            </Badge>
          ))}
        </div>
        <Textarea
          placeholder="Ex: dicas de treino em casa para iniciantes..."
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          rows={3}
          className="bg-zinc-900 border-zinc-700 resize-none"
        />
        <Button onClick={gerar} disabled={loading || !tema.trim()}>
          {loading ? "Gerando..." : "Gerar Roteiro"}
        </Button>
      </div>

      {resultado && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-400">Roteiro gerado</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{resultado}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
