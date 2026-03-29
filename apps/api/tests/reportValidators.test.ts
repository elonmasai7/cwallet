import {
  createReportSchema,
  reportIdSchema,
  updateReportSchema,
} from "../src/validators/reportValidators";

describe("report validators", () => {
  it("accepts a valid report payload", () => {
    const payload = createReportSchema.parse({
      title: "Broken health center pump",
      description: "Water pump at the local clinic has been stalled for weeks.",
      latitude: -1.2921,
      longitude: 36.8219,
      location: "Nairobi West",
    });

    expect(payload.location).toBe("Nairobi West");
  });

  it("rejects invalid coordinates", () => {
    expect(() =>
      createReportSchema.parse({
        title: "Broken road",
        description: "This description is long enough to pass the minimum length check.",
        latitude: 120,
      }),
    ).toThrow();
  });

  it("accepts only known moderation states", () => {
    expect(updateReportSchema.parse({ status: "APPROVED" }).status).toBe("APPROVED");
    expect(() => updateReportSchema.parse({ status: "ARCHIVED" })).toThrow();
  });

  it("validates report ids as cuids", () => {
    expect(() => reportIdSchema.parse({ id: "plain-text" })).toThrow();
  });
});

