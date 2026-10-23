"use client";

import { useCallback, useEffect, useState } from "react";

export function readCookieValue(cookieHeader: string, name: string) {
  const encodedName = encodeURIComponent(name);
  for (const cookie of cookieHeader.split(";")) {
    const [key, ...valueParts] = cookie.trim().split("=");
    if (key === encodedName) {
      const value = valueParts.join("=");
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  return undefined;
}

export function useCookieState<T extends string>(
  name: string,
  defaultValue?: T,
  config?: { expires?: number },
) {
  const [state, setState] = useState<T>();

  const handleChange = useCallback(
    (value: T) => {
      if (typeof document !== "undefined") {
        // `expires` is a duration in ms; the cookie needs an absolute date
        const ttl = config?.expires ?? 365 * 24 * 60 * 60 * 1000; // one year
        const expires = new Date(Date.now() + ttl).toUTCString();
        const secure = location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Expires=${expires}; SameSite=Lax${secure}`;
        setState(value);
      }
    },
    [name, config?.expires],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const value = readCookieValue(document.cookie, name) as T | undefined;
    setState(value ?? defaultValue);
  }, [defaultValue, name]);

  return [state, handleChange] as const;
}
