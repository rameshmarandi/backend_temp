import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  regenerateRefreshToken,
  registerUser,
  testRouter,
  updateAccountDetails,
  updateUserAvatar,
  userLogout,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

//Secure roues

router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, userLogout);
router.route("/refresh-token").post(regenerateRefreshToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router.route("/update-user-details").post(verifyJWT, updateAccountDetails);
router.route("/updateUserAvatar").post(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateUserAvatar
);
router.route("/testBackend").get(testRouter)

export default router;
