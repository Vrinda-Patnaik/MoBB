import { handleCuratorRequest } from "../../lib/gemini";

export const onRequestPost = async (context: { request: Request; env: Record<string, any> }) => {
  try {
    const body = (await context.request.json().catch(() => ({}))) as any;
    const result = await handleCuratorRequest(body, context.env);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        reply: "The Curator encountered a cosmic disturbance. *Quack*",
        source: "error-fallback",
        error: String(err),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
