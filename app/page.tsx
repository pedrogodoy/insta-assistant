import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const modules = [
  {
    href: "/roteiro",
    title: "Roteiro de Vídeo",
    description: "Gere scripts completos para Reels e Stories com IA.",
    icon: "🎬",
  },
  {
    href: "/post",
    title: "Post + Legenda",
    description: "Crie legendas otimizadas com hashtags para posts estáticos.",
    icon: "✍️",
  },
  {
    href: "/video",
    title: "Edição de Vídeo",
    description: "Faça cortes simples e adicione legendas automáticas ao seu vídeo.",
    icon: "✂️",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Insta Assistant</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Seu assistente local para criação de conteúdo no Instagram.
        </p>
      </div>
      <div className="grid gap-4">
        {modules.map(({ href, title, description, icon }) => (
          <Link key={href} href={href}>
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {icon} {title}
                </CardTitle>
                <CardDescription className="text-zinc-400">{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
