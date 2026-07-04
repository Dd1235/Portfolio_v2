import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import defaultContent from "../content/content.json";
import type { Content } from "../types";

const STORAGE_KEY = "portfolio-content-v1";

interface ContentApi {
  content: Content;
  /** true when localStorage overrides are active (unexported edits) */
  dirty: boolean;
  update: (updater: (prev: Content) => Content) => void;
  exportJson: () => void;
  importJson: (file: File) => Promise<void>;
  reset: () => void;
}

const ContentContext = createContext<ContentApi | null>(null);

function loadInitial(): { content: Content; dirty: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profile && Array.isArray(parsed.projects) && Array.isArray(parsed.blogs)) {
        return { content: parsed as Content, dirty: true };
      }
    }
  } catch {
    // corrupted overrides fall back to defaults
  }
  return { content: defaultContent as Content, dirty: false };
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(loadInitial, []);
  const [content, setContent] = useState<Content>(initial.content);
  const [dirty, setDirty] = useState(initial.dirty);

  const update = useCallback((updater: (prev: Content) => Content) => {
    setContent((prev) => {
      const next = updater(prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setDirty(true);
  }, []);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const importJson = useCallback(async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || !parsed.profile || !Array.isArray(parsed.projects) || !Array.isArray(parsed.blogs)) {
      throw new Error("Not a valid content.json export");
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    setContent(parsed as Content);
    setDirty(true);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setContent(defaultContent as Content);
    setDirty(false);
  }, []);

  return (
    <ContentContext.Provider value={{ content, dirty, update, exportJson, importJson, reset }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentApi {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent outside ContentProvider");
  return ctx;
}
