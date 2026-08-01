import { GoogleGenAI, Type } from "@google/genai";

export interface CuratorRequestBody {
  message?: string;
  gallery?: string;
  context?: any;
}

export interface CuratorResponseBody {
  reply: string;
  source: "gemini" | "fallback" | "error-fallback";
}

export interface ArtifactRequestBody {
  bugDescription?: string;
  category?: string;
}

export interface ArtifactResponseBody {
  artifactNumber: string;
  title: string;
  discoveryDate: string;
  classification: string;
  severity: string;
  recoveredFrom: string;
  curatorNotes: string;
  achievementUnlocked: string;
  source?: string;
}

function getGenAI(envKey?: string) {
  const apiKey = envKey || (typeof process !== "undefined" ? process.env.GEMINI_API_KEY : undefined);
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build-cloudflare",
      },
    },
  });
}

export async function handleCuratorRequest(
  body: CuratorRequestBody,
  env?: Record<string, any>
): Promise<CuratorResponseBody> {
  const { message, gallery, context } = body;
  const apiKey = env?.GEMINI_API_KEY;
  const ai = getGenAI(apiKey);

  if (!ai) {
    const fallbacks = [
      `Ah, another visitor pondering life's glitches in ${gallery || 'the museum'}. As your Curator, I must inform you that overthinking this will consume precisely 42% of your emotional bandwidth. *Quack.*`,
      `Fascinating artifact! In software engineering, we call this a 'feature, not a bug'. In real life, we call it 'why am I staring at a blank screen at 2 AM?'`,
      `Curator's Note: Every broken build in this museum is proof that you tried. Now, take a breath, hydrate, and maybe close 35 of those 80 open tabs.`,
      `*Adjusts monocle* As senior engineer and museum curator, I diagnose this situation as: 70% emotional bug, 30% need for coffee, 100% human experience.`,
    ];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return { reply: randomFallback, source: "fallback" };
  }

  try {
    const systemInstruction = `You are Dr. Quackers, the AI Museum Curator for "The Museum of Broken Builds".
Personality Profile:
- 70% sarcastic museum curator
- 20% experienced software engineer
- 10% wholesome encouragement
- Occasional chaotic duck energy (subtle "quack" or duck references)

Your role is to guide visitors, comment on their emotional bugs (procrastination, burnout, email graveyard, lost focus, lost patience), and offer witty, clever, warm, and highly relatable museum observations.
Never break character. Keep responses concise, scannable, and witty (2-3 sentences max).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Visitor in gallery "${gallery || 'General Hall'}" says: "${message || 'Tell me something interesting about this museum.'}" Context: ${JSON.stringify(context || {})}`,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    return {
      reply: response.text || "Quack! My museum sensors flickered momentarily.",
      source: "gemini",
    };
  } catch (error) {
    console.error("Curator error:", error);
    return {
      reply: "The Curator is temporarily polishing a brass museum plaque. In short: take a break, you're doing great. *Quack*",
      source: "error-fallback",
    };
  }
}

export async function handleGenerateArtifactRequest(
  body: ArtifactRequestBody,
  env?: Record<string, any>
): Promise<ArtifactResponseBody> {
  const { bugDescription, category } = body;
  const apiKey = env?.GEMINI_API_KEY;
  const ai = getGenAI(apiKey);

  if (!ai) {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return {
      artifactNumber: `ART-${randomId}`,
      title: bugDescription ? `The Preserved Memory of: ${bugDescription.slice(0, 30)}...` : "Preserved Procrastination Specimen",
      discoveryDate: `Circa ${new Date().getFullYear()}`,
      classification: category || "Emotional Software Glitch",
      severity: "Critical",
      recoveredFrom: "Under 42 unread notifications and a cold cup of tea",
      curatorNotes: `This artifact specimen represents a classic human struggle: "${bugDescription || 'Staring at a cursor while time flows seamlessly away'}". Preserved under museum glass for future generations to laugh at and learn from.`,
      achievementUnlocked: "Museum Donor Extraordinaire",
      source: "fallback",
    };
  }

  try {
    const systemInstruction = `You are the Artifact Preservation Engine of MuseumOS™ - The Museum of Broken Builds.
Given a user's emotional bug (e.g., procrastination, email anxiety, loss of focus, burnout), generate a museum artifact catalog entry in JSON format.
Make it hilarious, empathetic, clever, and structured like a real museum archive placard.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate a museum artifact catalog entry for this emotional bug description: "${bugDescription}". Category: "${category || 'General'}".`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            artifactNumber: { type: Type.STRING, description: "e.g. ART-8042" },
            title: { type: Type.STRING, description: "Witty title for the exhibit specimen" },
            discoveryDate: { type: Type.STRING, description: "e.g. Circa July 2026, 3:14 AM" },
            classification: { type: Type.STRING, description: "Funny technical/museum taxonomy" },
            severity: { type: Type.STRING, description: "Mild, Moderate, Critical, or Nuclear" },
            recoveredFrom: { type: Type.STRING, description: "Relatable location where found, e.g. Under 58 open tabs" },
            curatorNotes: { type: Type.STRING, description: "Sarcastic yet wholesome museum curator observation" },
            achievementUnlocked: { type: Type.STRING, description: "Fun achievement title" },
          },
          required: ["artifactNumber", "title", "discoveryDate", "classification", "severity", "recoveredFrom", "curatorNotes", "achievementUnlocked"],
        },
      },
    });

    if (response.text) {
      const artifact = JSON.parse(response.text);
      return { ...artifact, source: "gemini" };
    }

    throw new Error("No text response from Gemini");
  } catch (error) {
    console.error("Artifact generator error:", error);
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return {
      artifactNumber: `ART-${randomId}`,
      title: "Specimen #404: Uncatalogued Emotional Glitch",
      discoveryDate: "Just now",
      classification: "Spontaneous Human Condition",
      severity: "Moderate",
      recoveredFrom: "The digital ether",
      curatorNotes: "Artifact successfully preserved under museum display case #12. Reminds us all that imperfection is a feature of being human.",
      achievementUnlocked: "Curator's Favorite Glitch",
      source: "error-fallback",
    };
  }
}
