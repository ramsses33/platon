import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "PLATON_Whitepaper.pdf",
    );

    const pdfBuffer = await readFile(filePath);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition":
          'attachment; filename="PLATON_Whitepaper.pdf"',
        "Content-Length": String(pdfBuffer.byteLength),
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Whitepaper download error:", error);

    return new Response("Unable to download Whitepaper", {
      status: 500,
    });
  }
}
