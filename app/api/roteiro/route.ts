import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { tema, formato } = await req.json();

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4.6"),
    system: `Você é um especialista em criação de conteúdo para Instagram.
Crie roteiros concisos, dinâmicos e com ganchos fortes.
Use linguagem natural, próxima do público brasileiro.`,
    prompt: `Crie um roteiro de vídeo para Instagram no formato ${formato} sobre o tema: "${tema}".

Estruture o roteiro assim:
- GANCHO (primeiros 3 segundos)
- DESENVOLVIMENTO (pontos principais)
- CTA (call to action final)

Inclua indicações de tom, ritmo e sugestões visuais entre colchetes.`,
  });

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
