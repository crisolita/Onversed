import multer from "multer";
import Joivalidator from "express-joi-validation";
import express from "express";
import { authenticateToken } from "../middleware/auth";
import {
  addUser,
  deleteUSer,
  getUsers,
  updateDesign,
} from "../controllers/backoffice";
import { isAdmin } from "../middleware/isAdmin";
import {
  queryDeleteUser,
  querySchemaAddUser,
  queryUpdateDesign,
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
  updateDesign
);

export default router;
