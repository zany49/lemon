
import express from "express"
import {currentUser, loginController, logoutController, registerController} from "../controllers/authController.js"
import { requireSignin } from "../middleware/auth.js";
import { validateAuth } from "../middleware/validateBody.js";
const router = express.Router();

router.post('/register',validateAuth,registerController);
router.post('/login',validateAuth,loginController);
router.get('/check-user',requireSignin,currentUser)
router.get('/logout',requireSignin,logoutController)

export default router;