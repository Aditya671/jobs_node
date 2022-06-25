import express from "express";
import AuthController from "../controller/authController.js";
import authenticateUser from "../middleware/auth-middleware.js";
const authRouter = express.Router();
const authCon = new AuthController()

authRouter.post("/register",authCon.register);

authRouter.post("/login",authCon.login)

authRouter.patch("/updateUser",authenticateUser,authCon.updateUser);

export default authRouter;