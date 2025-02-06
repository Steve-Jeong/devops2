import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.route("/").get(authController.listAllUsers);
router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/whoami").get(authController.whoami);

export default router;
