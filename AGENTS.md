<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Insta Assistant

Aplicação web local (Next.js) para criação e edição de conteúdo para Instagram.
Roda em `localhost:3000` — não é deployada no Vercel.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui + Tailwind CSS v4 |
| AI | Vercel AI SDK + `@ai-sdk/anthropic` |
| Modelo | `claude-sonnet-4.6` |
| Vídeo | `ffmpeg` (sistema) via `execa` |
| Legendas | `whisper` CLI (opcional) |

## Módulos

### `/roteiro` — Roteiro de Vídeo
- Usuário descreve tema e escolhe formato (Reels 60s, 30s, Stories, Carrossel)
- API `POST /api/roteiro` chama Claude com prompt estruturado
- Retorna script com GANCHO → DESENVOLVIMENTO → CTA

### `/post` — Post + Legenda
- Usuário descreve o post e escolhe o tom (Inspirador, Educativo, Divertido, Direto)
- API `POST /api/post` chama Claude
- Retorna legenda com emojis, CTA e hashtags

### `/video` — Edição de Vídeo
- Upload de vídeo (MP4/MOV) no browser
- API `POST /api/video` recebe `FormData`, salva em `uploads/`, processa com ffmpeg
- Suporta: corte por tempo (início/fim) e legendas automáticas via Whisper
- Arquivo processado é retornado como blob e limpo do disco após o request

## Estrutura de Arquivos

```
app/
  layout.tsx          # Nav global
  page.tsx            # Dashboard com links para módulos
  roteiro/page.tsx    # UI do módulo de roteiro
  post/page.tsx       # UI do módulo de post
  video/page.tsx      # UI do módulo de vídeo
  api/
    roteiro/route.ts  # POST — gera roteiro com Claude
    post/route.ts     # POST — gera legenda com Claude
    video/route.ts    # POST — processa vídeo com ffmpeg
uploads/              # Arquivos temporários (gitignored)
```

## Setup Local

```bash
# 1. Instalar dependências do sistema
brew install ffmpeg
# brew install whisper  ← opcional, para legendas automáticas

# 2. Configurar variável de ambiente
cp .env.local.example .env.local
# editar .env.local com sua ANTHROPIC_API_KEY

# 3. Rodar
npm run dev
# Acesse: http://localhost:3000
```

## Convenções

- Model ID sempre com ponto na versão: `claude-sonnet-4.6` (não hífens)
- Uploads são temporários — criados e deletados por request em `uploads/`
- Sem autenticação — app local, não exposta publicamente
- Sem testes automatizados no momento — validação manual via browser
