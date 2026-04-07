import { writeFile, unlink, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { execa } from "execa";
import { NextResponse } from "next/server";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

async function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) await mkdir(UPLOADS_DIR, { recursive: true });
}

interface TextoOverlay {
  texto: string;
  posicao: "topo" | "centro" | "base";
  corFonte: string;
  tamanho: "pequeno" | "medio" | "grande";
  inicioSeg: number;
  fimSeg: number;
}

interface EditParams {
  inicio?: string;
  fim?: string;
  velocidade?: number;
  formato?: string;
  semAudio?: boolean;
  rotacao?: string;
  textos?: TextoOverlay[];
}

function escapeDrawtext(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/:/g, "\\:");
}

function buildDrawtext(t: TextoOverlay): string {
  const sizes = { pequeno: 28, medio: 48, grande: 72 };
  const fs = sizes[t.tamanho] ?? 48;
  const positions = {
    topo: "x=(w-text_w)/2:y=60",
    centro: "x=(w-text_w)/2:y=(h-text_h)/2",
    base: "x=(w-text_w)/2:y=h-text_h-60",
  };
  const xy = positions[t.posicao] ?? positions.topo;
  const enable =
    t.inicioSeg != null && t.fimSeg != null
      ? `:enable='between(t,${t.inicioSeg},${t.fimSeg})'`
      : "";
  return `drawtext=text='${escapeDrawtext(t.texto)}':fontcolor=${t.corFonte ?? "white"}:fontsize=${fs}:${xy}:box=1:boxcolor=black@0.4:boxborderw=8${enable}`;
}

async function parseDescricao(descricao: string): Promise<EditParams> {
  const prompt = `Você é um parser de edição de vídeo. Analise a descrição abaixo e retorne APENAS um objeto JSON válido (sem markdown, sem explicação).

Campos possíveis:
- inicio: string no formato "HH:MM:SS" ou vazio
- fim: string no formato "HH:MM:SS" ou vazio
- velocidade: número (0.25, 0.5, 0.75, 1, 1.5, 2, 4)
- formato: "original" | "quadrado" | "reels"
- semAudio: boolean
- rotacao: "" | "90cw" | "90ccw" | "180"
- textos: array de { texto, posicao ("topo"|"centro"|"base"), corFonte (ex: "white","yellow","red"), tamanho ("pequeno"|"medio"|"grande"), inicioSeg (número), fimSeg (número) }

Inclua apenas os campos mencionados na descrição. Se não tiver textos, omita o campo.

Descrição: "${descricao}"`;

  const { stdout } = await execa("claude", ["-p", prompt], {
    env: { ...process.env, ANTHROPIC_API_KEY: undefined },
  });

  // Extrai JSON da resposta (remove possível markdown)
  const match = stdout.match(/\{[\s\S]*\}/);
  if (!match) return {};
  return JSON.parse(match[0]);
}

export async function POST(req: Request) {
  await ensureUploadsDir();

  const form = await req.formData();
  const file = form.get("video") as File | null;
  if (!file) return new NextResponse("Nenhum vídeo enviado", { status: 400 });

  const descricao = (form.get("descricao") as string) || "";

  let params: EditParams;

  if (descricao.trim()) {
    try {
      params = await parseDescricao(descricao);
    } catch {
      params = {};
    }
  } else {
    params = {
      inicio: (form.get("inicio") as string) || "",
      fim: (form.get("fim") as string) || "",
      velocidade: parseFloat((form.get("velocidade") as string) || "1"),
      formato: (form.get("formato") as string) || "original",
      semAudio: form.get("semAudio") === "true",
      rotacao: (form.get("rotacao") as string) || "",
    };
  }

  const { inicio, fim, velocidade = 1, formato = "original", semAudio = false, rotacao = "", textos = [] } = params;

  const ts = Date.now();
  const inputPath = path.join(UPLOADS_DIR, `input-${ts}.mp4`);
  const outputPath = path.join(UPLOADS_DIR, `output-${ts}.mp4`);

  try {
    await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));

    const args: string[] = ["-y", "-i", inputPath];
    if (inicio) args.push("-ss", inicio);
    if (fim) args.push("-to", fim);

    const vf: string[] = [];
    const af: string[] = [];

    if (formato === "quadrado") vf.push("crop=min(iw\\,ih):min(iw\\,ih)");
    else if (formato === "reels") vf.push("crop=min(iw\\,ih*9/16):ih");

    if (rotacao === "90cw") vf.push("transpose=1");
    else if (rotacao === "90ccw") vf.push("transpose=2");
    else if (rotacao === "180") vf.push("transpose=1,transpose=1");

    if (velocidade !== 1) {
      vf.push(`setpts=${(1 / velocidade).toFixed(4)}*PTS`);
      if (velocidade >= 0.5 && velocidade <= 2) af.push(`atempo=${velocidade}`);
      else if (velocidade === 0.25) af.push("atempo=0.5,atempo=0.5");
      else if (velocidade === 4) af.push("atempo=2.0,atempo=2.0");
    }

    const legendas = form.get("legendas") === "true";
    if (legendas) {
      const srtPath = inputPath.replace(".mp4", ".srt");
      await execa("whisper", [inputPath, "--output_format", "srt", "--output_dir", UPLOADS_DIR]);
      vf.push(`subtitles=${srtPath}`);
    }

    for (const t of textos) vf.push(buildDrawtext(t));

    if (vf.length > 0) args.push("-vf", vf.join(","));
    if (semAudio) args.push("-an");
    else if (af.length > 0) args.push("-af", af.join(","));

    args.push("-c:v", "libx264", "-c:a", "aac", outputPath);

    await execa("ffmpeg", args);

    return new NextResponse(await readFile(outputPath), {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="video-editado.mp4"',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao processar vídeo";
    return new NextResponse(message, { status: 500 });
  } finally {
    await Promise.allSettled([unlink(inputPath), unlink(outputPath)]);
  }
}
