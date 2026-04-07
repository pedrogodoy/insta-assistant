import { execa } from "execa";

export async function POST(req: Request) {
  const { descricao, tom } = await req.json();

  const prompt = `Você é um especialista em copywriting para Instagram.
Crie legendas envolventes, autênticas e otimizadas para engajamento.
Use linguagem natural e próxima do público brasileiro.

Crie uma legenda para Instagram com tom "${tom}" para o seguinte post: "${descricao}".

Inclua:
- Texto principal (2-4 parágrafos curtos)
- Emojis estratégicos
- CTA claro
- 15-20 hashtags relevantes separadas no final`;

  const { stdout } = await execa("claude", ["-p", prompt], {
    env: { ...process.env, ANTHROPIC_API_KEY: undefined },
  });

  return new Response(stdout, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
