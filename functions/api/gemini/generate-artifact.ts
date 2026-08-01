import { handleGenerateArtifactRequest } from "../../lib/gemini";

export const onRequestPost = async (context: { request: Request; env: Record<string, any> }) => {
  try {
    const body = (await context.request.json().catch(() => ({}))) as any;
    const result = await handleGenerateArtifactRequest(body, context.env);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        artifactNumber: `ART-${Math.floor(1000 + Math.random() * 9000)}`,
        title: "Specimen #500: System Exception",
        discoveryDate: "Just now",
        classification: "Unhandled Glitch",
        severity: "Critical",
        recoveredFrom: "The void",
        curatorNotes: "Artifact preservation engine encountered an exception.",
        achievementUnlocked: "Glitch Hunter",
        source: "error-fallback",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
