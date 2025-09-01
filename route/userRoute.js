import { Router } from "express";
import { addUser, forgotPassword, Login, logout, resetPassword, userInfo } from "../controller/usercontroller.js";

const router = Router();

router.post('/', addUser);
router.post('/login', Login);
router.get("/me", userInfo),
router.post("/logout", logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

export default router