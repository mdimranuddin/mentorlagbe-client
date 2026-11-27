"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "./api";

export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true); setError("");
    try { setData(await apiFetch<T>(path)); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  }, [path]);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load, setData };
}
