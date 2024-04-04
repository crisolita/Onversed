import express from "express";
import {
  changePasswordController,
  getAuthCode,
  getPagos,
  getRecoveryCode,
  userEditProfile,
  userLoginController,
  userRegisterController,
} from "../controllers/user";
import Joivalidator from "express-joi-validation";
import { authenticateToken } from "../middleware/auth";
import {
  querySchemaChangePassword,
  querySchemaGetRecoveryCode,
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
router.post("/getAuth", validator.body(querySchemaUGetAuth), getAuthCode);
// router.get("/userInfo", authenticateToken, getUserInfo);

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
  authenticateToken,
  userEditProfile
);
router.get("/getPagosUser", authenticateToken, getPagos);
export default router;
