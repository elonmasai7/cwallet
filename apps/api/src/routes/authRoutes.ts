import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { login, logout, me, refresh, register } from "../controllers/authController";
import { loginSchema, refreshSchema, registerSchema } from "../validators/authValidators";

export const authRouter = Router();

authRouter.post("/register", validate({ body: registerSchema }), asyncHandler(register));
authRouter.post("/login", validate({ body: loginSchema }), asyncHandler(login));
authRouter.post("/refresh", validate({ body: refreshSchema }), asyncHandler(refresh));
authRouter.post("/logout", validate({ body: refreshSchema }), asyncHandler(logout));
authRouter.get("/me", requireAuth, asyncHandler(me));

