import { Router } from "express";
import { loginUser, regenerateRefreshToken, registerUser, userLogout } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields(
   [  {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    }
  ]
  ),
  registerUser
);

//Secure roues

router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT,userLogout);
router.route("refresh-token").post(regenerateRefreshToken)


export default router;
