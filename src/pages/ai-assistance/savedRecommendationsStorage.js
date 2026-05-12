import { SAVED_RECOMMENDATIONS_KEY } from "./constants";

export function safelyReadSavedRecommendations() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(SAVED_RECOMMENDATIONS_KEY) || "[]",
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
