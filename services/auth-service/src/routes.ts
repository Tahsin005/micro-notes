import { Router } from "express";
import * as authController from "./authController";
import { validateRequest } from "@shared/middleware";
import { loginSchema, refreshTokenSchema, registerSchema } from "./validation";

const router = Router();

//public routes
router.post(
    "/register",
    validateRequest(registerSchema),
    authController.register
);

router.post("/login", validateRequest(loginSchema), authController.login);
router.post(
    "/refresh",
    validateRequest(refreshTokenSchema),
    authController.refreshTokens
);
router.post(
    "/logout",
    validateRequest(refreshTokenSchema),
    authController.logout
);

export default router;