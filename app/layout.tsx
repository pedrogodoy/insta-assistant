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
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800 px-6 py-3 flex items-center gap-8">
          <Link href="/" className="font-semibold text-sm tracking-tight text-white">
            📸 Insta Assistant
          </Link>
          <nav className="flex gap-4">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">{children}</main>
      </body>
    </html>
  );
}
