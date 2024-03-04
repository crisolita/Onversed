// import express from "express";
// import {
//   addDoc,
//   addImage,
//   cambiarStatusDeTransferenciaParaXREN,
//   cambiarStatusDeTransferenciaParticipacion,
//   cancelarReclamacion,
//   cancelarReinversion,
//   changeRolUser,
//   createProject,
//   deleteImage,
//   deleteUser,
//   gestionVentaXREN,
//   gestionVisibilidadDoc,
//   getAllProjects,
//   getAllProjectsPublic,
//   getAllProjectsToAdmin,
//   getAllUsersController,
//   getCuentas,
//   getProjectPublic,
//   getProjectToAdmin,
//   getProjectToUser,
//   getTemplatesByPandaDoc,
//   manageSaleUser,
//   terminarReclamacion,
//   terminarReinversion,
//   updateKYCStatus,
//   updateProjectController,
//   updateProjectCuenta,
//   updateProjectEscenario,
//   updateProjectEstado,
//   updateProjectFechas,
//   updateProjectTemplateDocs,
// } from "../controllers/backoffice";
// import { isSuperAdmin } from "../middleware/isSuperAdmin";
// import { authenticateToken } from "../middleware/auth";
// import { isAdmin } from "../middleware/isAdmin";
// import {
//   querySchemaAddDoc,
//   querySchemaAddImage,
//   querySchemaChangeAdmin,
//   querySchemaCreate_project,
//   querySchemaDeleteImage,
//   querySchemaGestionVisibilidad,
//   querySchemaGetKYCbyUser,
//   querySchemaUpdateKycStatus,
//   querySchemaUpdateProject,
//   querySchemaUpdateProjectCuentas,
//   querySchemaUpdateProjectEscenario,
//   querySchemaUpdateProjectEstado,
//   querySchemaUpdateProjectFechas,
//   querySchemaUpdateProjectTemplate,
//   querySchemaUpdateProjectUserSaleManage,
//   querySchemaUpdateTransferParticipaciones,
//   querySchemaUpdateTransferXren,
// } from "../middleware/validation";
// import Joivalidator from "express-joi-validation";
// import { getkycUser } from "../controllers/user";

// const validator = Joivalidator.createValidator({ passError: true });

// const router = express.Router();

// //proyectos
// router.post(
//   "/create-project",
//   validator.body(querySchemaCreate_project),
//   isAdmin,
//   createProject
// );
// router.get("/getProjectsToUser", authenticateToken, getAllProjects);
// router.get("/getProjects", getAllProjectsPublic);
// // cambiar aqui ambos
// router.post("/getProjectPublic", getProjectPublic);
// router.post("/getProjectUser", authenticateToken, getProjectToUser);

// router.get("/getProjectsToAdmin", isAdmin, getAllProjectsToAdmin);

// router.delete(
//   "/deleteImage",
//   validator.body(querySchemaDeleteImage),
//   isAdmin,
//   deleteImage
// );
// router.post(
//   "/addImage",
//   validator.body(querySchemaAddImage),
//   isAdmin,
//   addImage
// );
// router.post("/addDoc", validator.body(querySchemaAddDoc), isAdmin, addDoc);
// router.post("/endClaim", isAdmin, terminarReclamacion);
// router.post("/cancelClaim", isAdmin, cancelarReclamacion);
// router.post("/endReinvest", isAdmin, terminarReinversion);
// router.post("/cancelReinvest", isAdmin, cancelarReinversion);

// //gestion
// router.post(
//   "/updateEscenario",
//   validator.body(querySchemaUpdateProjectEscenario),
//   isAdmin,
//   updateProjectEscenario
// );
// router.post(
//   "/updateFechas",
//   validator.body(querySchemaUpdateProjectFechas),
//   isAdmin,
//   updateProjectFechas
// );

// router.put(
//   "/updateCuenta",
//   validator.body(querySchemaUpdateProjectCuentas),
//   isAdmin,
//   updateProjectCuenta
// );
// router.put(
//   "/updateProject",
//   validator.body(querySchemaUpdateProject),
//   isAdmin,
//   updateProjectController
// );
// router.put(
//   "/updateEstado",
//   validator.body(querySchemaUpdateProjectEstado),
//   isAdmin,
//   updateProjectEstado
// );

// router.post(
//   "/manageUserSale",
//   validator.body(querySchemaUpdateProjectUserSaleManage),
//   isAdmin,
//   manageSaleUser
// );

// router.post(
//   "/updatetemplate",
//   validator.body(querySchemaUpdateProjectTemplate),
//   isAdmin,
//   updateProjectTemplateDocs
// );
// router.post(
//   "/updateDocVisibilidad",
//   validator.body(querySchemaGestionVisibilidad),
//   isAdmin,
//   gestionVisibilidadDoc
// );

// router.post("/getProjectToAdmin", isAdmin, getProjectToAdmin);

// ///vistas
// router.get("/cuentas", getCuentas);
// router.get("/getKycByUser", isAdmin, getkycUser);

// router.get("/templates", isAdmin, getTemplatesByPandaDoc);
// router.get("/users", isAdmin, getAllUsersController);

// /// elimino este?
// // router.get("/usersByProject",isAdmin,getAllUsersByProject)

// //Compra XREN
// router.post("/gestionCompraXren", gestionVentaXREN);
// router.put(
//   "/updateTransferenciaXREN",
//   validator.body(querySchemaUpdateTransferXren),
//   isAdmin,
//   cambiarStatusDeTransferenciaParaXREN
// );

// //gestion KYC
// router.put(
//   "/manageKYC",
//   validator.body(querySchemaUpdateKycStatus),
//   updateKYCStatus
// );

// ///gestion usuarios
// router.post(
//   "/changeAdmin",
//   validator.body(querySchemaChangeAdmin),
//   isSuperAdmin,
//   changeRolUser
// );

// /// gestion compra participaciones
// router.put(
//   "/update-transferencia-participacion",
//   validator.body(querySchemaUpdateTransferParticipaciones),
//   isAdmin,
//   cambiarStatusDeTransferenciaParticipacion
// );

// router.post("/deleteUsers", isAdmin, deleteUser);

// export default router;
