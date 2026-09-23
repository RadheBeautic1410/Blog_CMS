/**
 * Orbit AI layer.
 *
 * One `generateJson()` call, four interchangeable providers. Every provider is
 * reached over plain fetch so Orbit adds no npm dependency; switching provider
 * is a settings change plus the matching API key in the environment.
 *
 * Note: if Anthropic ever becomes the primary provider here, prefer the
 * official `@anthropic-ai/sdk` over the raw HTTP call below.
 */

export type OrbitProviderId = "gemini" | "anthropic" | "openai" | "groq";

export const ORBIT_PROVIDERS: {
  id: OrbitProviderId;
  label: string;
  envKey: string;
  defaultModel: string;
  free: boolean;
  keyUrl: string;
}[] = [
  {
    id: "gemini",
    label: "Google Gemini (free tier)",
    envKey: "GEMINI_API_KEY",
    defaultModel: "gemini-2.5-flash",
    free: true,
    keyUrl: "https://aistudio.google.com/apikey",
  },
  {
    id: "groq",
    label: "Groq / Llama (free tier)",
    envKey: "GROQ_API_KEY",
    defaultModel: "llama-3.3-70b-versatile",
    free: true,
    keyUrl: "https://console.groq.com/keys",
  },
  {
    id: "anthropic",
    label: "Anthropic Claude (paid)",
    envKey: "ANTHROPIC_API_KEY",
    defaultModel: "claude-opus-5",
    free: false,
    keyUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "openai",
    label: "OpenAI (paid)",
    envKey: "OPENAI_API_KEY",
    defaultModel: "gpt-4o-mini",
    free: false,
    keyUrl: "https://platform.openai.com/api-keys",
  },
];

export function getProviderMeta(provider: string) {
  return ORBIT_PROVIDERS.find((p) => p.id === provider) ?? ORBIT_PROVIDERS[0];
}

export function getProviderApiKey(provider: string): string | undefined {
  switch (provider) {
    case "gemini":
      return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY;
    case "openai":
      return process.env.OPENAI_API_KEY;
    case "groq":
      return process.env.GROQ_API_KEY;
    default:
      return undefined;
  }
}

export function isProviderConfigured(provider: string): boolean {
  return Boolean(getProviderApiKey(provider));
}

interface GenerateArgs {
  provider: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

/** Ask the configured model for a JSON object and parse it. */
export async function generateJson<T = Record<string, unknown>>(
  args: GenerateArgs
): Promise<T> {
  const apiKey = getProviderApiKey(args.provider);
  const meta = getProviderMeta(args.provider);

  if (!apiKey) {
    throw new Error(
      `${meta.envKey} is not set. Add it to your environment to use ${meta.label}.`
    );
  }

  const model = args.model || meta.defaultModel;
  const maxTokens = args.maxTokens ?? 8000;
  const call = { ...args, model, maxTokens, apiKey };

  let raw: string;
  switch (args.provider) {
    case "anthropic":
      raw = await callAnthropic(call);
      break;
    case "openai":
      raw = await callOpenAiCompatible({
        ...call,
        baseUrl: "https://api.openai.com/v1",
      });
      break;
    case "groq":
      raw = await callOpenAiCompatible({
        ...call,
        baseUrl: "https://api.groq.com/openai/v1",
      });
      break;
    case "gemini":
    default:
      raw = await callGemini(call);
      break;
  }

  return parseJsonResponse<T>(raw);
}

type ProviderCall = GenerateArgs & {
  model: string;
  maxTokens: number;
  apiKey: string;
};

async function callGemini({
  model,
  systemPrompt,
  userPrompt,
  maxTokens,
  apiKey,
}: ProviderCall): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json",
      },
    }),
  });

  const data = await readJson(response, "Gemini");

  const blocked = data?.promptFeedback?.blockReason;
  if (blocked) {
    throw new Error(`Gemini blocked the prompt (${blocked}).`);
  }

  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts)
    ? parts.map((p: any) => p?.text ?? "").join("")
    : "";

  if (!text.trim()) {
    const finish = data?.candidates?.[0]?.finishReason;
    throw new Error(
      `Gemini returned an empty response${
        finish ? ` (finishReason: ${finish})` : ""
      }.`
    );
  }
  return text;
}

async function callAnthropic({
  model,
  systemPrompt,
  userPrompt,
  maxTokens,
  apiKey,
}: ProviderCall): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  const data = await readJson(response, "Anthropic");

  if (data?.stop_reason === "refusal") {
    const why = data?.stop_details?.explanation;
    throw new Error(
      `Claude declined this request${why ? `: ${why}` : "."}`
    );
  }

  const text = (data?.content ?? [])
    .filter((block: any) => block?.type === "text")
    .map((block: any) => block.text)
    .join("");

  if (!text.trim()) {
    throw new Error("Anthropic returned an empty response.");
  }
  return text;
}

async function callOpenAiCompatible({
  model,
  systemPrompt,
  userPrompt,
  maxTokens,
  apiKey,
  baseUrl,
}: ProviderCall & { baseUrl: string }): Promise<string> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  const label = baseUrl.includes("groq") ? "Groq" : "OpenAI";
  const data = await readJson(response, label);
  const text = data?.choices?.[0]?.message?.content ?? "";

  if (!text.trim()) {
    throw new Error(`${label} returned an empty response.`);
  }
  return text;
}

async function readJson(response: Response, providerLabel: string) {
  const body = await response.text();

  if (!response.ok) {
    let detail = body.slice(0, 500);
    try {
      const parsed = JSON.parse(body);
      detail = parsed?.error?.message || parsed?.message || detail;
    } catch {
      // keep the raw snippet
    }
    throw new Error(`${providerLabel} API error ${response.status}: ${detail}`);
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`${providerLabel} returned a non-JSON response.`);
  }
}

/** Models sometimes wrap JSON in prose or a code fence - dig the object out. */
function parseJsonResponse<T>(raw: string): T {
  const trimmed = raw.trim();

  const candidates = [
    trimmed,
    trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""),
  ];

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(trimmed.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // try the next shape
    }
  }

  throw new Error(
    `Could not parse JSON from the model response: ${trimmed.slice(0, 200)}`
  );
}
