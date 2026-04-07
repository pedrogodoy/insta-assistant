import Link from "next/link";

const modules = [
  {
    href: "/roteiro",
    title: "Roteiro de Vídeo",
    description: "Gere scripts completos para Reels e Stories com estrutura GANCHO → DESENVOLVIMENTO → CTA.",
    icon: "🎬",
    gradient: "from-violet-500/20 to-violet-500/5",
    border: "hover:border-violet-500/40",
    tag: "Reels · Stories · Carrossel",
  },
  {
    href: "/post",
    title: "Post + Legenda",
    description: "Crie legendas otimizadas com emojis, call-to-action e hashtags para posts estáticos.",
    icon: "✍️",
    gradient: "from-pink-500/20 to-pink-500/5",
    border: "hover:border-pink-500/40",
    tag: "Inspirador · Educativo · Divertido",
  },
  {
    href: "/video",
    title: "Edição de Vídeo",
    description: "Faça cortes por tempo e adicione legendas automáticas ao seu vídeo com ffmpeg.",
    icon: "✂️",
    gradient: "from-orange-500/20 to-orange-500/5",
    border: "hover:border-orange-500/40",
    tag: "MP4 · MOV · Whisper",
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
          Insta Assistant
        </h1>
        <p className="text-zinc-400 text-base max-w-md">
          Seu assistente local para criação de conteúdo no Instagram — rápido, privado e sem complicação.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {modules.map(({ href, title, description, icon, gradient, border, tag }) => (
          <Link key={href} href={href} className="group block">
            <div
              className={`relative h-full rounded-xl border border-white/8 bg-gradient-to-b ${gradient} p-5 transition-all duration-200 ${border} hover:bg-zinc-900/60`}
            >
              <div className="mb-4 text-3xl">{icon}</div>
              <h2 className="font-semibold text-white text-sm mb-1">{title}</h2>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">{description}</p>
              <span className="text-[10px] text-zinc-600 font-mono">{tag}</span>
              <div className="absolute bottom-4 right-4 text-zinc-600 group-hover:text-zinc-400 transition-colors text-xs">
                →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
