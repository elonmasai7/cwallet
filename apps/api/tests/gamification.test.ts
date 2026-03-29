import { resolveLevel } from "../src/utils/gamification";

describe("resolveLevel", () => {
  it("returns Beginner for low points", () => {
    expect(resolveLevel(10)).toBe("Beginner");
  });

  it("returns Advocate for mid-tier points", () => {
    expect(resolveLevel(30)).toBe("Advocate");
  });

  it("returns Watchdog for high points", () => {
    expect(resolveLevel(100)).toBe("Watchdog");
  });
});

