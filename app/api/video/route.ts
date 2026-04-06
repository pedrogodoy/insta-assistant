import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { execa } from "execa";
import { NextResponse } from "next/server";

export const config = { api: { bodyParser: false } };

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

async function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) await mkdir(UPLOADS_DIR, { recursive: true });
}

export async function POST(req: Request) {
  await ensureUploadsDir();

  const form = await req.formData();
  const file = form.get("video") as File | null;
  if (!file) return new NextResponse("Nenhum vídeo enviado", { status: 400 });

  const inicio = (form.get("inicio") as string) || "";
  const fim = (form.get("fim") as string) || "";
  const legendas = form.get("legendas") === "true";

  const inputPath = path.join(UPLOADS_DIR, `input-${Date.now()}.mp4`);
  const outputPath = path.join(UPLOADS_DIR, `output-${Date.now()}.mp4`);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    const args: string[] = ["-y", "-i", inputPath];

    if (inicio) args.push("-ss", inicio);
    if (fim) args.push("-to", fim);

    if (legendas) {
      // Burn subtitles via Whisper SRT — requires whisper CLI installed
      const srtPath = inputPath.replace(".mp4", ".srt");
      await execa("whisper", [inputPath, "--output_format", "srt", "--output_dir", UPLOADS_DIR]);
      args.push("-vf", `subtitles=${srtPath}`);
    }

    args.push("-c:v", "libx264", "-c:a", "aac", outputPath);

    await execa("ffmpeg", args);

    const { readFile } = await import("fs/promises");
    const outputBuffer = await readFile(outputPath);

    return new NextResponse(outputBuffer, {
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
