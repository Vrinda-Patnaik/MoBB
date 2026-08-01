import { CuratorResponseBody, ArtifactResponseBody } from '../../functions/lib/gemini';

export interface AskCuratorParams {
  message: string;
  gallery?: string;
  context?: Record<string, any>;
}

export interface GenerateArtifactParams {
  bugDescription: string;
  category?: string;
}

export interface ApiOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const signal = init.signal
    ? AbortSignal.any ? AbortSignal.any([init.signal, controller.signal]) : controller.signal
    : controller.signal;

  try {
    const response = await fetch(url, { ...init, signal });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export async function askCurator(
  params: AskCuratorParams,
  options?: ApiOptions
): Promise<CuratorResponseBody> {
  try {
    const res = await fetchWithTimeout(
      '/api/gemini/curator',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: options?.signal,
      },
      options?.timeoutMs || 12000
    );

    if (!res.ok) {
      throw new Error(`Curator API returned HTTP status ${res.status}`);
    }

    const data = (await res.json()) as CuratorResponseBody;
    return data;
  } catch (error: any) {
    console.error('askCurator API error:', error);
    return {
      reply: "The Curator's connection momentarily flickered, but here is my timeless advice: Hydrate, close 10 browser tabs, and take a deep breath. *Quack*",
      source: "error-fallback",
    };
  }
}

export async function generateArtifact(
  params: GenerateArtifactParams,
  options?: ApiOptions
): Promise<ArtifactResponseBody> {
  try {
    const res = await fetchWithTimeout(
      '/api/gemini/generate-artifact',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: options?.signal,
      },
      options?.timeoutMs || 15000
    );

    if (!res.ok) {
      throw new Error(`Generate Artifact API returned HTTP status ${res.status}`);
    }

    const data = (await res.json()) as ArtifactResponseBody;
    return data;
  } catch (error: any) {
    console.error('generateArtifact API error:', error);
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return {
      artifactNumber: `ART-${randomId}`,
      title: params.bugDescription ? `Preserved Specimen: ${params.bugDescription.slice(0, 30)}` : "Specimen #404: Uncatalogued Glitch",
      discoveryDate: `Circa ${new Date().getFullYear()}`,
      classification: params.category || "Spontaneous Human Condition",
      severity: "Moderate",
      recoveredFrom: "The digital ether",
      curatorNotes: "Artifact preserved under display glass. Reminds us all that imperfection is a natural part of building software.",
      achievementUnlocked: "Museum Donor Extraordinaire",
      source: "error-fallback",
    };
  }
}
