import multer from "multer";
import Joivalidator from "express-joi-validation";
import express from "express";
import { authenticateToken } from "../middleware/auth";
import {
  addUser,
  createPriceToFormats,
  deleteUSer,
  getAllPagos,
  getUsers,
  sendConfirmLastArt,
  sendConfirmOrFaltaDeInfo,
  sendLinkToUser,
  sendThanks,
  updateDesignStatus,
} from "../controllers/backoffice";
import { isAdmin } from "../middleware/isAdmin";
import {
  queryConfirmFalta,
  queryConfirmLastArt,
  queryDeleteUser,
  querySchemaAddUser,
  querySendLink,
  querySendThanks,
  queryUpdateDesign,
  queryUpdatePrice,
} from "../middleware/validation";
const router = express.Router();

// Configuración de Multer
const storage = multer.memoryStorage(); // Almacena la imagen en la memoria, puedes ajustarlo según tus necesidades
const upload = multer({ storage: storage });
const validator = Joivalidator.createValidator({ passError: true });

router.get("/users", isAdmin, getUsers);
router.post("/addUser", validator.body(querySchemaAddUser), isAdmin, addUser);
router.post(
  "/deleteUser",
  validator.body(queryDeleteUser),
  isAdmin,
  deleteUSer
);
router.post(
  "/updateDesign",
  validator.body(queryUpdateDesign),
  isAdmin,
  updateDesignStatus
);
router.post(
  "/updatePriceFormat",
  validator.body(queryUpdatePrice),
  isAdmin,
  createPriceToFormats
);
router.post(
  "/confirm-falta",
  validator.body(queryConfirmFalta),
  isAdmin,
  sendConfirmOrFaltaDeInfo
);
router.post(
  "/sendLink",
  validator.body(querySendLink),
  isAdmin,
  sendLinkToUser
);
router.post(
  "/sendThanks",
  validator.body(querySendThanks),
  isAdmin,
  sendThanks
);

router.post(
  "/confirmLastArt",
  validator.body(queryConfirmLastArt),
  isAdmin,
  sendConfirmLastArt
);

router.get("/getAllPagos", isAdmin, getAllPagos);

export default router;
