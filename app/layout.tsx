import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Insta Assistant",
  description: "Assistente para criação de conteúdo no Instagram",
};

const nav = [
  { href: "/roteiro", label: "Roteiro" },
  { href: "/post", label: "Post" },
  { href: "/video", label: "Vídeo" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <header className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold text-sm tracking-tight">
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
                Insta Assistant
              </span>
            </Link>
            <nav className="flex gap-1">
              {nav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-white/5"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full">{children}</main>
      </body>
    </html>
  );
}
