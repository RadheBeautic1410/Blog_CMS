import { prisma } from "@/lib/prisma";
import { getProviderMeta } from "@/lib/orbit/ai";

export const ORBIT_SETTINGS_KEY = "default";

/** Orbit settings are a single row; create it on first read. */
export async function getOrbitSettings() {
  return prisma.orbitSettings.upsert({
    where: { key: ORBIT_SETTINGS_KEY },
    update: {},
    create: { key: ORBIT_SETTINGS_KEY },
  });
}

export type OrbitSettings = Awaited<ReturnType<typeof getOrbitSettings>>;

/** The model to use, falling back to the provider default when unset. */
export function resolveModel(settings: {
  provider: string;
  model: string | null;
}) {
  return settings.model?.trim() || getProviderMeta(settings.provider).defaultModel;
}
