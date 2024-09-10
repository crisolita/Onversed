import express from "express";
import {
  changePasswordController,
  getAuthCode,
  getPagos,
  getRecoveryCode,
  getUserInfo,
  userEditProfile,
  userGoogleController,
  userLoginController,
  userRegisterController,
} from "../controllers/user";
import Joivalidator from "express-joi-validation";
import { authenticateToken } from "../middleware/auth";
import {
  querySchemaChangePassword,
  querySchemaEditProfile,
  querySchemaGetRecoveryCode,
  querySchemaGoogle,
  querySchemaLogin,
  querySchemaRegistro,
  querySchemaUGetAuth,
} from "../middleware/validation";
import multer from "multer";

// Configuración de Multer
const storage = multer.memoryStorage(); // Almacena la imagen en la memoria, puedes ajustarlo según tus necesidades
const upload = multer({ storage: storage });
const validator = Joivalidator.createValidator({ passError: true });

const router = express.Router();

router.post(
  "/register",
  validator.body(querySchemaRegistro),
  userRegisterController
);
router.post("/login", validator.body(querySchemaLogin), userLoginController);
router.post("/validate", validator.body(querySchemaUGetAuth), getAuthCode);

router.post(
  "/getRecovery",
  validator.body(querySchemaGetRecoveryCode),
  getRecoveryCode
);
router.post(
  "/changePassword",
  validator.body(querySchemaChangePassword),
  changePasswordController
);
router.post(
  "/editProfile",
  upload.single("foto_de_perfil"),
  validator.body(querySchemaEditProfile),
  authenticateToken,
  userEditProfile
);
router.get("/getPagosUser", authenticateToken, getPagos);
router.get("/getUserInfo", authenticateToken, getUserInfo);
router.post(
  "/registerLoginGoogle",
  validator.body(querySchemaGoogle),
  userGoogleController
);
export default router;
