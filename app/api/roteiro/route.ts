import { execa } from "execa";

export async function POST(req: Request) {
  const { tema, formato } = await req.json();

  const prompt = `Você é um especialista em criação de conteúdo para Instagram.
Crie roteiros concisos, dinâmicos e com ganchos fortes.
Use linguagem natural, próxima do público brasileiro.

Crie um roteiro de vídeo para Instagram no formato ${formato} sobre o tema: "${tema}".

Estruture o roteiro assim:
- GANCHO (primeiros 3 segundos)
- DESENVOLVIMENTO (pontos principais)
- CTA (call to action final)

Inclua indicações de tom, ritmo e sugestões visuais entre colchetes.`;

  const { stdout } = await execa("claude", ["-p", prompt], {
    env: { ...process.env, ANTHROPIC_API_KEY: undefined },
  });

  return new Response(stdout, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
