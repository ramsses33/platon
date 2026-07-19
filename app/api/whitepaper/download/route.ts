export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const pdfUrl = new URL("/PLATON_Whitepaper.pdf", request.url);

    const pdfResponse = await fetch(pdfUrl, {
      cache: "no-store",
    });

    if (!pdfResponse.ok) {
      return new Response("Whitepaper PDF not found", {
        status: 404,
      });
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="PLATON_Whitepaper.pdf"',
        "Content-Length": String(pdfBuffer.byteLength),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Whitepaper download error:", error);

    return new Response("Unable to download Whitepaper", {
      status: 500,
    });
  }
}
