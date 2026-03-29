process.env.NODE_ENV = "test";

import request from "supertest";
import { app } from "../src/app";

describe("core app routes", () => {
  it("returns ok for health", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("returns cache headers on public finance snapshot", async () => {
    const response = await request(app).get("/api/dashboard/public-finance");

    expect(response.status).toBe(200);
    expect(response.headers["cache-control"]).toContain("max-age=300");
    expect(response.body.currency).toBe("KES");
  });

  it("returns 404 for unknown routes", async () => {
    const response = await request(app).get("/missing-route");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Route not found");
  });
});

