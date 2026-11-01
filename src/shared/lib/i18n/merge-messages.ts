/** A next-intl messages tree: nested objects with string leaves. */
export interface MessagesTree {
  [key: string]: string | MessagesTree;
}

/**
 * Deep-merges a locale's messages over the English fallback, so a locale file only has to contain
 * what is translated. Missing keys and empty strings fall back to English. Returns a new object.
 */
export const mergeMessages = <T extends MessagesTree>(fallback: T, overrides: MessagesTree): T => {
  const result: MessagesTree = { ...fallback };

  for (const [key, value] of Object.entries(overrides)) {
    const base = result[key];

    if (typeof value === "string") {
      if (value !== "") result[key] = value;
    } else if (base !== undefined && typeof base !== "string") {
      result[key] = mergeMessages(base, value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
};
