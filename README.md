## The Museum of Broken Builds

A playful interactive museum celebrating human tech struggles, burnout, lost patience, email graveyards, and lost focus.

## Architecture

This project is optimized for deployment on **Cloudflare Pages** using native **Cloudflare Pages Functions**:

- **Frontend**: React 19 + Vite + Tailwind CSS + Lucide Icons + Motion
- **Serverless API**: Cloudflare Pages Functions (`/functions/api/gemini/curator.ts`, `/functions/api/gemini/generate-artifact.ts`)
- **AI SDK**: `@google/genai` (Gemini 3.6 Flash model)
- **Persistence**: Versioned localStorage with migration support (`src/lib/storage.ts`)

## Directory Structure

```
museumos/
├── functions/
│   ├── api/
│   │   └── gemini/
│   │       ├── curator.ts             # POST /api/gemini/curator
│   │       └── generate-artifact.ts   # POST /api/gemini/generate-artifact
│   └── lib/
│       └── gemini.ts                  # Shared Gemini AI module & fallbacks
├── src/
│   ├── components/                     # Museum galleries & components
│   ├── hooks/                          # Custom hooks (useMuseumStats, useArtifacts, etc.)
│   ├── lib/
│   │   ├── api.ts                      # Typed frontend API layer
│   │   ├── storage.ts                  # Centralized versioned storage
│   │   ├── sound.ts                    # Audio synthesizers
│   │   └── museumStore.ts              # Museum data stores
│   ├── types.ts                        # TypeScript interfaces
│   ├── App.tsx                         # Main museum layout
│   └── main.tsx                        # Application entry point
├── wrangler.toml                       # Cloudflare Pages configuration
├── vite.config.ts                      # Vite configuration with local dev API plugin
└── package.json
```

## Cloudflare Pages Deployment

1. Connect your repository to **Cloudflare Pages**.
2. Set Build Settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Add Environment Variable in Cloudflare Pages Settings:
   - `GEMINI_API_KEY`: Your Google Gemini API Key

Cloudflare Pages automatically detects the `/functions` directory and deploys the API endpoints as native edge functions.

## Local Development

```bash
npm install
npm run dev
```

During local development, Vite serves the app on port 3000 and simulates the `/api/gemini/*` functions via a lightweight dev server plugin in `vite.config.ts`.
