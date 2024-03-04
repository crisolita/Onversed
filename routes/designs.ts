import multer from "multer";
import Joivalidator from "express-joi-validation";
import express from "express";
import { createCollection, createRequestDesign } from "../controllers/designs";
const router = express.Router();

// Configuración de Multer
const storage = multer.memoryStorage(); // Almacena la imagen en la memoria, puedes ajustarlo según tus necesidades
const upload = multer({ storage: storage });
const validator = Joivalidator.createValidator({ passError: true });

router.post("/createCollection", createCollection);

router.post("/createDesign", upload.single("media"), createRequestDesign);

export default router;
