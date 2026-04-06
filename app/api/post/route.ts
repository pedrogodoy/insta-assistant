import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { descricao, tom } = await req.json();

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4.6"),
    system: `Você é um especialista em copywriting para Instagram.
Crie legendas envolventes, autênticas e otimizadas para engajamento.
Use linguagem natural e próxima do público brasileiro.`,
    prompt: `Crie uma legenda para Instagram com tom "${tom}" para o seguinte post: "${descricao}".

Inclua:
- Texto principal (2-4 parágrafos curtos)
- Emojis estratégicos
- CTA claro
- 15-20 hashtags relevantes separadas no final`,
  });

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
