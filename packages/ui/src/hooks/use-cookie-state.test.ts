import { describe, expect, it } from "vitest";

import { readCookieValue } from "./use-cookie-state";

describe("readCookieValue", () => {
  it("matches the complete cookie name", () => {
    expect(readCookieValue("theme-dark=true; theme=light", "theme")).toBe(
      "light",
    );
  });

  it("decodes encoded names and values", () => {
    expect(
      readCookieValue("status%20page=a%3Db%20%26%20c", "status page"),
    ).toBe("a=b & c");
  });

  it("preserves equals signs in legacy unencoded values", () => {
    expect(readCookieValue("token=header.payload=signature", "token")).toBe(
      "header.payload=signature",
    );
  });

  it("returns undefined when the cookie is absent", () => {
    expect(readCookieValue("theme=dark", "currency")).toBeUndefined();
  });

  it("does not throw for malformed percent encoding", () => {
    expect(readCookieValue("value=%E0%A4%A", "value")).toBe("%E0%A4%A");
  });
});
