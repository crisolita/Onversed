import multer from "multer";
import Joivalidator from "express-joi-validation";
import express from "express";
import {
  confirmOrChangeDesign,
  confirmPayOfRequestDesign,
  createCollection,
  createRequestDesign,
  getCollections,
  getDesignsRequested,
  sendDrawDesignController,
} from "../controllers/designs";
import { authenticateToken } from "../middleware/auth";
import {
  queryConfirmChange,
  queryConfirmPaid,
  querySchemaCreateCollection,
  querySchemaCreateRequestDesign,
  querySendDraw,
} from "../middleware/validation";
const router = express.Router();

// Configuración de Multer
const storage = multer.memoryStorage(); // Almacena la imagen en la memoria, puedes ajustarlo según tus necesidades
const upload = multer({ storage: storage });
const validator = Joivalidator.createValidator({ passError: true });

router.post(
  "/createCollection",
  validator.body(querySchemaCreateCollection),
  authenticateToken,
  createCollection
);

router.post(
  "/createDesign",
  upload.single("media"),
  validator.body(querySchemaCreateRequestDesign),
  authenticateToken,
  createRequestDesign
);
router.get("/getCollections", authenticateToken, getCollections);
router.get("/getDesigns", authenticateToken, getDesignsRequested);
router.post(
  "/confirm-change",
  validator.body(queryConfirmChange),
  authenticateToken,
  confirmOrChangeDesign
);
router.post(
  "/confirmPaid",
  validator.body(queryConfirmPaid),
  authenticateToken,
  confirmPayOfRequestDesign
);
router.post(
  "/sendDrawDesign",
  validator.body(querySendDraw),
  authenticateToken,
  sendDrawDesignController
);
export default router;
