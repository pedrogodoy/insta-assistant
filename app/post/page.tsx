"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tons = ["Inspirador", "Educativo", "Divertido", "Direto ao ponto"];

export default function PostPage() {
  const [descricao, setDescricao] = useState("");
  const [tom, setTom] = useState("Inspirador");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">✍️ Post + Legenda</h1>
        <p className="text-zinc-400 text-sm mt-1">Descreva o post e escolha o tom da legenda.</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {tons.map((t) => (
            <Badge
              key={t}
              variant={tom === t ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTom(t)}
            >
              {t}
            </Badge>
          ))}
        </div>
        <Textarea
          placeholder="Ex: foto na academia, leg day concluído..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          className="bg-zinc-900 border-zinc-700 resize-none"
        />
        <Button onClick={gerar} disabled={loading || !descricao.trim()}>
          {loading ? "Gerando..." : "Gerar Legenda"}
        </Button>
      </div>

      {resultado && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-400">Legenda gerada</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{resultado}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
