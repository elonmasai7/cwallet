import { loginSchema, registerSchema } from "../src/validators/authValidators";

describe("auth validators", () => {
  it("accepts a valid registration payload", () => {
    const payload = registerSchema.parse({
      name: "Demo User",
      email: "demo@example.com",
      password: "StrongPass123!",
      phone: "+254700000002",
    });

    expect(payload.email).toBe("demo@example.com");
  });

  it("rejects weak registration payloads", () => {
    expect(() =>
      registerSchema.parse({
        name: "A",
        email: "invalid",
        password: "123",
      }),
    ).toThrow();
  });

  it("accepts a valid login payload", () => {
    const payload = loginSchema.parse({
      email: "demo@example.com",
      password: "StrongPass123!",
    });

    expect(payload.password).toHaveLength(15);
  });
});

