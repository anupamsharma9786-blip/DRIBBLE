import { Router } from "express";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { getMe, login, register, verifyEmail } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router()

authRouter.post("/register", registerValidator, register)

authRouter.post("/login", loginValidator, login)

authRouter.get("/get-me", authUser, getMe)

authRouter.get("/verify-email/:emailVerificationToken", verifyEmail)

export default authRouter