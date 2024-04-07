import type { TClient } from "./types";

export const socketStore = {
  clients: {} as Record<string, TClient>,
}