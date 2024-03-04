// import { PrismaClient, User } from "@prisma/client";
// import { Request, Response } from "express";
// import {
//   deleteImageAWS,
//   getDoc,
//   getImage,
//   uploadDoc,
//   uploadImage,
// } from "../service/aws";
// import {
//   createGestionXREN,
//   getProjectById,
//   updateEscenario,
//   updateFechas,
//   updateGestionXREN,
//   updateProject,
// } from "../service/backoffice";
// import moment from "moment";
// import { getOrderById, updateOrder } from "../service/participaciones";
// import { crearPago } from "../service/pagos";
// import {
//   crearDocumentoDeCompra,
//   crearDocumentoDeIntercambio,
//   getTemplates,
//   isValidTemplate,
// } from "../service/pandadoc";
// import {
//   getAllUsers,
//   getKycInfoByUser,
//   getUserById,
//   updateKyc,
//   updateUser,
// } from "../service/user";
// import { ethers } from "ethers";
// import { saleContract, xperiendNFT } from "../service/web3";
// import {
//   compraAnuladaNoFirma,
//   compraAnuladaNoPagado,
//   compraRealizadaInvesthome,
//   reclamacionRealizada,
//   reinversionRealizada,
//   sendKycAprobado,
//   sendKycRechazado,
//   sendPagoCanceladoXREN,
//   sendTransferenciaRecibidaParticipaciones,
//   sendWelcomeClub,
// } from "../service/mail";

// export const convertFullName = (str: string) =>
//   str.split(", ").reverse().join(" ");

// export const createProject = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { titulo, ubicacion, definicion, resumen } = req.body;
//     // @ts-ignore
//     // const USER= req.user as User;

//     const data = await prisma.projects.create({
//       data: {
//         titulo,
//         ubicacion,
//         definicion,
//         resumen,
//         estado: "NUEVO",
//       },
//     });

//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// /// Actualizacion del proyecto
// export const deleteImage = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { path } = req.body;
//     await prisma.projectImages.delete({ where: { path: path } });
//     await deleteImageAWS(path);
//     return res.json({ data: "Imagen eliminada con exito" });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };
// export const addImage = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { project_id, images } = req.body;
//     let project = await prisma.projects.findUnique({
//       where: { id: project_id },
//     });
//     if (!project) return res.status(404).json({ error: "NOT PROJECT FOUND" });
//     let data;
//     for (let image of images) {
//       const data = Buffer.from(
//         image.base64.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
//         "base64"
//       );

//       if (image.rol == "PRINCIPAL" || image.rol == "NFT") {
//         const exist = await prisma.projectImages.findFirst({
//           where: { project_id: project_id, rol: image.rol },
//         });
//         if (exist) {
//           // // Utiliza fetch aquí dentro
//           await uploadImage(data, exist.path);
//         } else {
//           const path = `${project.titulo.replace(/\s/g, "_")}_${
//             image.rol
//           }_${project_id}_${project.count_image ? project.count_image + 1 : 1}`;
//           await prisma.projectImages.create({
//             data: {
//               project_id: project_id,
//               path: path,
//               rol: image.rol,
//             },
//           });
//           await uploadImage(data, path);
//         }
//       } else {
//         const path = `${project.titulo.replace(/\s/g, "_")}_${
//           image.rol
//         }_${project_id}_${project.count_image ? project.count_image + 1 : 1}`;
//         await prisma.projectImages.create({
//           data: {
//             project_id: project_id,
//             path: path,
//             rol: image.rol,
//           },
//         });
//         await uploadImage(data, path);
//       }
//       project = await prisma.projects.update({
//         where: { id: project_id },
//         data: {
//           count_image: project.count_image ? project.count_image + 1 : 1,
//         },
//       });
//     }
//     return res.json({ data: "Imagen subida con exito" });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };

// ///Subir documentos asociados a proyectos
// export const addDoc = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { project_id, docs } = req.body;
//     const project = await prisma.projects.findUnique({
//       where: { id: project_id },
//     });
//     if (!project) return res.status(404).json({ error: "NOT PROJECT FOUND" });
//     for (let doc of docs) {
//       const path = `${project.titulo.replace(/\s/g, "_")}_${project_id}_${
//         doc.rol
//       }`;
//       const exist = await prisma.projectDocs.findUnique({ where: { path } });
//       if (!exist) {
//         await prisma.projectDocs.create({
//           data: {
//             project_id: project_id,
//             path: path,
//             visible: false,
//             rol: doc.rol,
//             user_rol_visible: "OWNER",
//           },
//         });
//       }
//       // // Utiliza fetch aquí dentro
//       const data = Buffer.from(
//         doc.base64.replace(/^data:application\/(pdf);base64,/, ""),
//         "base64"
//       );

//       await uploadDoc(data, path);
//     }

//     return res.json({ data: "Documentos subidos con exito" });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };
// /// gestion proyecto

// export const updateProjectEscenario = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const {
//       project_id,
//       escenario,
//       aporte_inversores,
//       beneficio,
//       rentabilidad,
//       coste_activo,
//       costo_construccion,
//       gestion_xperiend,
//       coste_desarrollo,
//       coste_promocion,
//       recursion,
//     } = req.body;
//     let data;
//     const exist = await prisma.escenario_economico.findFirst({
//       where: { project_id: project_id, escenario: escenario },
//     });
//     if (exist) {
//       data = await updateEscenario(exist.id, req.body, prisma);
//     } else {
//       data = await prisma.escenario_economico.create({
//         data: {
//           project_id,
//           escenario,
//           aporte_inversores,
//           beneficio,
//           rentabilidad,
//           coste_activo,
//           costo_construccion,
//           gestion_xperiend,
//           coste_desarrollo,
//           coste_promocion,
//           recursion,
//         },
//       });
//     }

//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };
// export const updateProjectFechas = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const {
//       project_id,
//       fecha_inicio_reinversion,
//       fecha_fin_reinversion,
//       fecha_fin_reclamo,
//       fecha_inicio_reclamo,
//       fecha_fin_venta,
//       fecha_inicio_intercambio,
//       fecha_fin_intercambio,
//       visible_user,
//       visible_premium,
//       visible_gold,
//       visible_intercambio,
//       visible_reclamo,
//       visible_reinversion,
//     } = req.body;
//     let data;

//     const exist = await prisma.gestion_fechas.findUnique({
//       where: { project_id: project_id },
//     });
//     if (exist) {
//       data = await updateFechas(
//         project_id,
//         {
//           fecha_inicio_reinversion: fecha_inicio_reinversion
//             ? new Date(fecha_inicio_reinversion)
//             : undefined,
//           fecha_fin_reinversion: fecha_fin_reinversion
//             ? new Date(fecha_fin_reinversion)
//             : undefined,
//           fecha_fin_reclamo: fecha_fin_reclamo
//             ? new Date(fecha_fin_reclamo)
//             : undefined,
//           fecha_inicio_reclamo: fecha_inicio_reclamo
//             ? new Date(fecha_inicio_reclamo)
//             : undefined,
//           fecha_inicio_intercambio: fecha_inicio_intercambio
//             ? new Date(fecha_inicio_intercambio)
//             : undefined,
//           fecha_fin_intercambio: fecha_fin_intercambio
//             ? new Date(fecha_fin_intercambio)
//             : undefined,
//           fecha_fin_venta: fecha_fin_venta
//             ? new Date(fecha_fin_venta)
//             : undefined,
//           visible_user,
//           visible_premium,
//           visible_gold,
//           visible_intercambio,
//           visible_reclamo,
//           visible_reinversion,
//         },
//         prisma
//       );
//     } else {
//       data = await prisma.gestion_fechas.create({
//         data: {
//           project_id,
//           fecha_fin_venta: fecha_fin_venta
//             ? new Date(fecha_fin_venta)
//             : undefined,
//           fecha_inicio_reinversion: fecha_inicio_reinversion
//             ? new Date(fecha_inicio_reinversion)
//             : undefined,
//           fecha_fin_reinversion: fecha_fin_reinversion
//             ? new Date(fecha_fin_reinversion)
//             : undefined,
//           fecha_fin_reclamo: fecha_fin_reclamo
//             ? new Date(fecha_fin_reclamo)
//             : undefined,
//           fecha_inicio_reclamo: fecha_inicio_reclamo
//             ? new Date(fecha_inicio_reclamo)
//             : undefined,
//           fecha_inicio_intercambio: fecha_inicio_intercambio
//             ? new Date(fecha_inicio_intercambio)
//             : undefined,
//           fecha_fin_intercambio: fecha_fin_intercambio
//             ? new Date(fecha_fin_intercambio)
//             : undefined,
//           visible_user,
//           visible_premium,
//           visible_gold,
//         },
//       });
//     }

//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };
// export const updateProjectCuenta = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { project_id, numero, titular, banco, concepto_bancario } = req.body;
//     let data;
//     const exist = await prisma.cuentas.findFirst({
//       where: { numero: numero, banco: banco },
//     });
//     if (exist) {
//       data = await updateProject(
//         project_id,
//         { cuenta_id: exist.id, concepto_bancario },
//         prisma
//       );
//     } else {
//       const newCuenta = await prisma.cuentas.create({
//         data: {
//           numero,
//           banco,
//           titular,
//         },
//       });
//       data = await updateProject(
//         project_id,
//         { cuenta_id: newCuenta.id, concepto_bancario },
//         prisma
//       );
//     }

//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// export const updateProjectController = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const {
//       project_id,
//       titulo,
//       ubicacion,
//       definicion,
//       resumen,
//       rentabilidad_estimada,
//       beneficio_estimado,
//       plazo_ejecucion,
//       ejecucion_proyecto,
//       cantidad,
//       precio_unitario,
//       beneficioPorNFT,
//       proyectoReinversion,
//       description,
//       recuperar_dinero_info,
//       pagoTransferencia,
//       pagoTarjeta,
//       pagoCripto,
//     } = req.body;
//     const project = await getProjectById(project_id, prisma);
//     if (!project)
//       return res.status(404).json({ error: "Proyecto no encontrado" });
//     const data = await updateProject(
//       project_id,
//       {
//         titulo,
//         ubicacion,
//         definicion,
//         resumen,
//         rentabilidad_estimada,
//         beneficio_estimado,
//         plazo_ejecucion,
//         ejecucion_proyecto,
//         cantidadInicial: cantidad,
//         cantidadRestante: cantidad,
//         precio_unitario,
//         beneficioPorNFT,
//         proyectoReinversion,
//         description,
//         recuperar_dinero_info,
//         pagoTarjeta,
//         pagoTransferencia,
//         pagoCripto,
//       },
//       prisma
//     );

//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };
// export const updateProjectEstado = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { project_id, estado } = req.body;
//     const project = await getProjectById(project_id, prisma);
//     let data;
//     if (!project)
//       return res.status(404).json({ error: "Proyecto no encontrado" });
//     switch (project.estado) {
//       case "NUEVO":
//         if (estado !== "PROXIMAMENTE")
//           return res.status(400).json({ error: "Estado incorrecto" });
//         data = await prisma.projects.update({
//           where: { id: project.id },
//           data: { estado: estado },
//         });
//         break;
//       case "PROXIMAMENTE":
//         if (estado !== "PUBLICO")
//           return res.status(400).json({ error: "Estado incorrecto" });
//         data = await prisma.projects.update({
//           where: { id: project.id },
//           data: { estado: estado },
//         });
//         break;
//       case "PUBLICO":
//         if (estado !== "ABIERTO")
//           return res.status(400).json({ error: "Estado incorrecto" });
//         data = await prisma.projects.update({
//           where: { id: project.id },
//           data: { estado: estado },
//         });
//         break;
//       case "ABIERTO":
//         if (estado !== "EN_PROCESO" && estado !== "NO_COMPLETADO")
//           return res.status(400).json({ error: "Estado incorrecto" });
//         data = await prisma.projects.update({
//           where: { id: project.id },
//           data: { estado: estado },
//         });
//         break;
//       case "EN_PROCESO":
//         if (estado !== "CERRADO")
//           return res.status(400).json({ error: "Estado incorrecto" });
//         data = await prisma.projects.update({
//           where: { id: project.id },
//           data: { estado: estado },
//         });
//         break;
//       case "CERRADO":
//         if (estado !== "TERMINADO")
//           return res.status(400).json({ error: "Estado incorrecto" });
//         data = await prisma.projects.update({
//           where: { id: project.id },
//           data: { estado: estado },
//         });
//         break;
//       case "TERMINADO":
//         return res.status(400).json({ error: "Estado terminado" });
//     }
//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };
// export const updateProjectTemplateDocs = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { project_id, template_id, document_type } = req.body;
//     let data;
//     const isValid = await isValidTemplate(template_id);
//     if (!isValid)
//       return res
//         .status(404)
//         .json({ error: "Template no encontrado en PandaDoc" });
//     const isAlready = await prisma.templates.findFirst({
//       where: { project_id, document_type },
//     });
//     const project = await getProjectById(project_id, prisma);
//     if (!project)
//       return res.status(400).json({ error: "Proyecto no encontrado" });
//     if (isAlready) {
//       data = await prisma.templates.update({
//         where: { id: isAlready.id },
//         data: {
//           template_id: template_id,
//         },
//       });
//     } else {
//       data = await prisma.templates.create({
//         data: {
//           template_id: template_id,
//           project_id: project_id,
//           document_type,
//         },
//       });
//     }
//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// export const gestionVisibilidadDoc = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { project_id, rol, user_rol_visible, visible } = req.body;
//     const project = await prisma.projects.findUnique({
//       where: { id: project_id },
//     });
//     if (!project) return res.status(404).json({ error: "NOT PROJECT FOUND" });
//     const path = `${project.titulo.replace(/\s/g, "_")}_${project_id}_${rol}`;
//     const exist = await prisma.projectDocs.findUnique({ where: { path } });
//     if (!exist)
//       return res.status(404).json({
//         error: `Documento ${rol} no ha sido subido en este proyecto ${project_id}`,
//       });
//     const updated = await prisma.projectDocs.update({
//       where: { path },
//       data: { user_rol_visible, visible },
//     });
//     return res.json(updated);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };

// //gestion user venta de proyectos
// export const manageSaleUser = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { project_id, tipoDeUser, openingDate, minXRENwallet, minXRENstake } =
//       req.body;
//     const project = await getProjectById(project_id, prisma);
//     const isValid = moment(openingDate).isValid();
//     if (!isValid) return res.status(400).json({ error: "Fecha invalida" });
//     let data;
//     if (!project)
//       return res.status(404).json({ error: "Proyecto no encontrado" });
//     const exist = await prisma.userManage.findFirst({
//       where: { project_id: project.id, tipoDeUser: tipoDeUser },
//     });
//     if (exist) {
//       data = await prisma.userManage.update({
//         where: { id: exist.id },
//         data: {
//           openingDate: new Date(openingDate),
//           minXRENstake: minXRENstake,
//           minXRENwallet: minXRENwallet,
//         },
//       });
//     } else {
//       data = await prisma.userManage.create({
//         data: {
//           project_id: project_id,
//           tipoDeUser: tipoDeUser,
//           openingDate: new Date(openingDate),
//           minXRENstake: minXRENstake,
//           minXRENwallet: minXRENwallet,
//         },
//       });
//     }
//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// /// gestion de pagos por transferencia bancaria
// //endpoint que va a llamar el admin
// export const cambiarStatusDeTransferenciaParticipacion = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;

//     const {
//       order_id,
//       amountUSD,
//       status,
//       fecha_recibido,
//       fecha_devolucion,
//       info_devolucion,
//     } = req.body;
//     const order = await getOrderById(order_id, prisma);
//     if (!order) return res.status(404).json({ error: "Orden no encontrada" });
//     let user = await getUserById(order.user_id, prisma);
//     let kyc = await getKycInfoByUser(order.user_id, prisma);

//     if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
//     const project = await getProjectById(order.project_id, prisma);
//     let pago, template;
//     if (status == "CONFIRMADO") {
//       if (order?.tipo == "COMPRA") {
//         if (!project || !project.precio_unitario || !amountUSD)
//           return res.status(400).json({
//             error: "No es una transaccion de venta y/o montos no definidos",
//           });
//         const mod = amountUSD % project.precio_unitario;
//         const result = amountUSD / project.precio_unitario;
//         if (mod != 0)
//           return res
//             .status(400)
//             .json({ error: "Monto no es relativo al precio unitario" });
//         pago = await crearPago(
//           order.user_id,
//           amountUSD,
//           "TRANSFERENCIA_BANCARIA",
//           new Date(fecha_recibido),
//           "Compra de participacion",
//           prisma
//         );
//         template = await prisma.templates.findFirst({
//           where: { project_id: project.id, document_type: order.tipo },
//         });

//         if (!template)
//           return res.status(404).json({ error: "No template id encontrado" });

//         const docData = await crearDocumentoDeCompra(
//           order.user_id,
//           project.id,
//           order,
//           template.template_id,
//           prisma
//         );
//         if (!docData)
//           return res.status(500).json({ error: "Falla al crear documento" });

//         const newOrder = await updateOrder(
//           order.id,
//           {
//             document_id: docData.id,
//             url_sign: docData.link,
//             status: "POR_FIRMAR",
//             cantidad: result,
//           },
//           prisma
//         );
//         await sendTransferenciaRecibidaParticipaciones(
//           user?.email,
//           `${kyc?.name} ${kyc?.lastname}`
//         );
//         await compraRealizadaInvesthome(
//           user.email,
//           `${kyc?.name} ${kyc?.lastname}`
//         );

//         return res.status(200).json({ pago, newOrder });
//       } else if (order?.tipo == "INTERCAMBIO") {
//         if (!project || !project.precio_unitario || !order.exchange_receiver)
//           return res.status(400).json({
//             error: "No es una transaccion de usuario y/o montos definidos",
//           });
//         template = await prisma.templates.findFirst({
//           where: { project_id: project.id, document_type: "INTERCAMBIO" },
//         });
//         console.log(template);
//         if (!template)
//           return res.status(404).json({ error: "No template  encontrado" });

//         pago = await crearPago(
//           order.user_id,
//           project.precio_unitario,
//           "TRANSFERENCIA_BANCARIA",
//           new Date(fecha_recibido),
//           "Compra de participacion por intercambio",
//           prisma
//         );

//         const docData = await crearDocumentoDeIntercambio(
//           order.user_id,
//           order.exchange_receiver,
//           project.id,
//           template.template_id,
//           prisma
//         );
//         if (!docData)
//           return res.status(500).json({ error: "Falla al crear documento" });
//         const newOrder = await updateOrder(
//           order.id,
//           {
//             document_id: docData.id,
//             url_sign: docData.link,
//             status: "POR_FIRMAR",
//           },
//           prisma
//         );
//         return res.status(200).json({ pago, newOrder });
//       }
//     } else if (status == "CANCELADO") {
//       const user = await getUserById(order.user_id, prisma);
//       if (!user)
//         return res.status(404).json({ error: "USUARIO NO ENCONTRADO" });
//       const newOrder = await updateOrder(
//         order.id,
//         { status: "PAGO_CANCELADO" },
//         prisma
//       );
//       await compraAnuladaNoPagado(user.email, `${kyc?.name} ${kyc?.lastname}`);
//       return res.status(200).json(newOrder);
//     } else if (status == "DEVUELTO") {
//       const user = await getUserById(order.user_id, prisma);
//       if (!user)
//         return res.status(404).json({ error: "USUARIO NO ENCONTRADO" });
//       const newOrder = await updateOrder(
//         order.id,
//         {
//           status: "PAGO_DEVUELTO",
//           fecha_devolucion: new Date(fecha_devolucion),
//           info_devolucion,
//         },
//         prisma
//       );
//       await compraAnuladaNoFirma(user.email, `${kyc?.name} ${kyc?.lastname}`);
//       return res.status(200).json(newOrder);
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };
// //endpoint para gestionar que ya el admin ha pagado al vendedor por alguna participacion
// export const terminarIntercambio = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { order_id } = req.body;
//     const order = await getOrderById(order_id, prisma);
//     if (
//       !order ||
//       order.status != "FIRMADO_POR_ENTREGAR" ||
//       order.tipo != "INTERCAMBIO"
//     )
//       return res.status(404).json({ error: "Orden no encontrada" });
//     const endExchange = await xperiendNFT.endExchange(
//       order.nft_id,
//       order.exchange_receiver
//     );
//     const updated = await updateOrder(
//       order_id,
//       { status: "PAGADO_Y_ENTREGADO_Y_FIRMADO" },
//       prisma
//     );
//     res.json({ endExchange, updated });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// export const cancelarIntercambio = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { order_id } = req.body;
//     const order = await getOrderById(order_id, prisma);
//     if (
//       !order ||
//       order.status != "FIRMADO_POR_ENTREGAR" ||
//       order.tipo != "INTERCAMBIO"
//     )
//       return res.status(404).json({ error: "Orden no encontrada" });
//     const cancelExchange = await xperiendNFT.cancelExchange(order.nft_id);
//     const updated = await updateOrder(
//       order_id,
//       { status: "PAGO_CANCELADO" },
//       prisma
//     );
//     res.json({ cancelExchange, updated });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// ///Vistas
// // imagenes, escenario, cuenta, fechas,userSale

// export const getAllProjectsToAdmin = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     let data = [];
//     let escenario,
//       fechas,
//       cuenta,
//       keyImagenes,
//       userSale = [];
//     const projects = await prisma.projects.findMany();
//     const users = await getAllUsers(prisma);
//     for (let project of projects) {
//       const finishedOrders = await prisma.orders.findMany({
//         where: {
//           project_id: project.id,
//           status: "PAGADO_Y_ENTREGADO_Y_FIRMADO",
//         },
//       });
//       let ordersCompra = await prisma.orders.findMany({
//         where: { project_id: project.id, tipo: "COMPRA" },
//       });
//       let ordersIntercambio = await prisma.orders.findMany({
//         where: { project_id: project.id, tipo: "INTERCAMBIO" },
//       });
//       let ordersReclamacion = await prisma.orders.findMany({
//         where: { project_id: project.id, tipo: "RECLAMACION" },
//       });
//       let ordersReinversion = await prisma.orders.findMany({
//         where: { project_id: project.id, tipo: "REINVERSION" },
//       });
//       let ordersActiveCompra = ordersCompra.filter((x) => {
//         return (
//           x.status == "FIRMADO_POR_ENTREGAR" ||
//           x.status == "PAGO_PENDIENTE" ||
//           x.status == "POR_FIRMAR"
//         );
//       });
//       let ordersActiveIntercambio = ordersIntercambio.filter((x) => {
//         return (
//           x.status == "FIRMADO_POR_ENTREGAR" ||
//           x.status == "PAGO_PENDIENTE" ||
//           x.status == "POR_FIRMAR" ||
//           x.status == "POR_INTERCAMBIAR"
//         );
//       });
//       let ordersActiveReinversion = ordersReinversion.filter((x) => {
//         return (
//           x.status == "FIRMADO_POR_ENTREGAR" ||
//           x.status == "PAGO_PENDIENTE" ||
//           x.status == "POR_FIRMAR"
//         );
//       });
//       let ordersActiveReclamacion = ordersReclamacion.filter((x) => {
//         return (
//           x.status == "FIRMADO_POR_ENTREGAR" ||
//           x.status == "PAGO_PENDIENTE" ||
//           x.status == "POR_FIRMAR"
//         );
//       });

//       escenario = await prisma.escenario_economico.findMany({
//         where: { project_id: project.id },
//       });
//       fechas = await prisma.gestion_fechas.findMany({
//         where: { project_id: project.id },
//       });
//       if (project.cuenta_id) {
//         cuenta = await prisma.cuentas.findUnique({
//           where: { id: project.cuenta_id },
//         });
//       }
//       userSale = await prisma.userManage.findMany({
//         where: { project_id: project.id },
//       });
//       keyImagenes = await prisma.projectImages.findMany({
//         where: { project_id: project.id },
//       });
//       let imagenes = [];
//       for (let key of keyImagenes) {
//         const ruta = await getImage(key.path);
//         imagenes.push({
//           rol: key.rol,
//           id: key.id,
//           path: ruta,
//         });
//       }
//       let favsUser = [];
//       for (let user of users) {
//         if (user.favoritos.includes(project.id)) {
//           favsUser.push({
//             username: user.userName,
//             email: user.email,
//           });
//         }
//       }
//       let investors = [];
//       for (let order of finishedOrders) {
//         const user = await getUserById(order.user_id, prisma);
//         investors.push({
//           userId: order.user_id,
//           email: user?.email,
//           newsletter: user?.newsletter,
//           cantidad: order.cantidad,
//           fecha: order.fecha,
//         });
//       }
//       data.push({
//         project,
//         escenario,
//         fechas,
//         cuenta,
//         imagenes,
//         userSale,
//         investors,
//         favsUser,
//         comprasActivas: ordersActiveCompra.length,
//         comprasTerminados: ordersCompra.length - ordersActiveCompra.length,
//         participaciones_activas:
//           project.cantidadInicial && project.cantidadRestante
//             ? project.cantidadInicial - project.cantidadRestante
//             : 0,
//         reinversionActiva: ordersActiveReinversion.length,
//         reinversionTerminada:
//           ordersReinversion.length - ordersActiveReinversion.length,
//         reclamacionActiva: ordersActiveReclamacion.length,
//         reclamacionTerminada:
//           ordersReclamacion.length - ordersActiveReclamacion.length,
//         participacionesTerminadas:
//           ordersReinversion.length -
//           ordersActiveReinversion.length +
//           ordersReclamacion.length -
//           ordersActiveReclamacion.length,
//       });
//     }
//     return res.json(data);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };
// export const getAllProjects = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     // @ts-ignore
//     const USER = req.user as User;
//     let data = [];
//     let escenario,
//       fechas,
//       cuenta,
//       keyImagenes,
//       userSale = [];
//     const projects = await prisma.projects.findMany();
//     const user = await getUserById(USER.id, prisma);
//     for (let project of projects) {
//       escenario = await prisma.escenario_economico.findMany({
//         where: { project_id: project.id },
//       });
//       fechas = await prisma.gestion_fechas.findFirst({
//         where: { project_id: project.id },
//       });
//       if (project.cuenta_id) {
//         cuenta = await prisma.cuentas.findUnique({
//           where: { id: project.cuenta_id },
//         });
//       }
//       userSale = await prisma.userManage.findMany({
//         where: { project_id: project.id },
//       });
//       keyImagenes = await prisma.projectImages.findMany({
//         where: { project_id: project.id },
//       });
//       let imagenes = [];
//       for (let key of keyImagenes) {
//         const ruta = await getImage(key.path);
//         imagenes.push({
//           rol: key.rol,
//           id: key.id,
//           path: ruta,
//         });
//       }
//       const documentosUser = await prisma.projectDocs.findMany({
//         where: {
//           visible: true,
//           user_rol_visible: "CLIENT",
//           project_id: project.id,
//         },
//       });

//       let documentos: any[] = [];
//       if (user?.kycStatus === "APROBADO") {
//         const documentosKyc = await prisma.projectDocs.findMany({
//           where: {
//             visible: true,
//             user_rol_visible: "KYC",
//             project_id: project.id,
//           },
//         });

//         const owner = await prisma.orders.findFirst({
//           where: {
//             user_id: user.id,
//             status: "PAGADO_Y_ENTREGADO_Y_FIRMADO",
//             project_id: project.id,
//           },
//         });

//         const documentosOwner = owner
//           ? await prisma.projectDocs.findMany({
//               where: {
//                 visible: true,
//                 user_rol_visible: "OWNER",
//                 project_id: project.id,
//               },
//             })
//           : [];

//         documentos = owner
//           ? documentosUser.concat(documentosKyc, documentosOwner)
//           : documentosKyc.concat(documentosUser);
//       } else {
//         documentos = documentosUser;
//       }

//       const docs = await Promise.all(
//         documentos.map(async (doc) => ({
//           id: doc.id,
//           rol: doc.rol,
//           path: await getDoc(doc.path),
//         }))
//       );

//       data.push({
//         project,
//         escenario,
//         fechas,
//         cuenta,
//         imagenes,
//         userSale,
//         docs,
//       });
//     }
//     return res.json(data);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };

// export const getAllProjectsPublic = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     let data = [];
//     let escenario,
//       fechas,
//       cuenta,
//       keyImagenes,
//       userSale = [];
//     const projects = await prisma.projects.findMany();
//     for (let project of projects) {
//       escenario = await prisma.escenario_economico.findMany({
//         where: { project_id: project.id },
//       });
//       fechas = await prisma.gestion_fechas.findFirst({
//         where: { project_id: project.id },
//       });
//       if (project.cuenta_id) {
//         cuenta = await prisma.cuentas.findUnique({
//           where: { id: project.cuenta_id },
//         });
//       }
//       userSale = await prisma.userManage.findMany({
//         where: { project_id: project.id },
//       });
//       keyImagenes = await prisma.projectImages.findMany({
//         where: { project_id: project.id },
//       });
//       let imagenes = [];
//       for (let key of keyImagenes) {
//         const ruta = await getImage(key.path);
//         imagenes.push({
//           rol: key.rol,
//           id: key.id,
//           path: ruta,
//         });
//       }

//       data.push({
//         project,
//         escenario,
//         fechas,
//         cuenta,
//         imagenes,
//         userSale,
//       });
//     }
//     return res.json(data);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };

// export const getCuentas = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const cuentas = await prisma.cuentas.findMany();
//     return res.json(cuentas);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };

// export const getTemplatesByPandaDoc = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const data = await getTemplates();
//     return res.json(data.results);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };

// ///KYC
// export const updateKYCStatus = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { kyc_id, status, motivo_rechazo_kyc } = req.body;
//     const kyc = await prisma.kycInfo.findUnique({ where: { id: kyc_id } });
//     if (!kyc) return res.status(404).json({ error: "Kyc no encontrado" });
//     const user = await getUserById(kyc.user_id, prisma);
//     if (!user) return res.status(404).json({ error: "Usuario no valido" });
//     await updateUser(
//       kyc.user_id,
//       { kycStatus: status, motivo_rechazo_kyc },
//       prisma
//     );
//     const updated = await updateKyc(kyc_id, { status }, prisma);
//     if (status == "APROBADO")
//       await sendKycAprobado(user.email, `${kyc.name} ${kyc.lastname}`);
//     if (status == "RECHAZADO")
//       await sendKycRechazado(user.email, `${kyc.name} ${kyc.lastname}`);

//     return res.json(updated);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ error: e });
//   }
// };

// export const getAllUsersController = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const users = await getAllUsers(prisma);
//     let data = [];
//     for (let user of users) {
//       let kycImgs = [];
//       const kyc = await getKycInfoByUser(Number(user.id), prisma);
//       if (kyc) {
//         const kycImgsKey = await prisma.kycImages.findMany({
//           where: { info_id: kyc?.id },
//         });
//         console.log(kycImgsKey);
//         for (let key of kycImgsKey) {
//           const ruta = await getImage(key.path);
//           kycImgs.push({
//             rol: key.rol,
//             path: ruta,
//           });
//         }
//       }
//       data.push({
//         userId: user.id,
//         userName: user.userName,
//         googleId: user.googleID,
//         user_rol: user.userRol,
//         email: user.email,
//         referrallFriend: user.referallFriend,
//         newsletter: user.newsletter,
//         kycStatus: user.kycStatus,
//         kycInfo: kyc,
//         kycImagenes: kycImgs,
//       });
//     }
//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };
// //gestion de venta de XREN

// export const gestionVentaXREN = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const {
//       numero,
//       banco,
//       titular,
//       pagoTransferencia,
//       pagoTarjeta,
//       pagoCripto,
//       concepto_bancario,
//     } = req.body;
//     const exist = await prisma.gestionXREN.findFirst();
//     let gestionXREN;
//     if (!exist && numero && banco) {
//       gestionXREN = await createGestionXREN(
//         {
//           numero,
//           banco,
//           pagoTransferencia,
//           titular,
//           pagoTarjeta,
//           pagoCripto,
//           concepto_bancario,
//         },
//         prisma
//       );
//     } else if (exist) {
//       gestionXREN = await updateGestionXREN(
//         exist.id,
//         {
//           numero,
//           banco,
//           pagoTransferencia,
//           titular,
//           pagoTarjeta,
//           pagoCripto,
//           concepto_bancario,
//         },
//         prisma
//       );
//     }

//     return res.json(gestionXREN);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ error: e });
//   }
// };
// export const cambiarStatusDeTransferenciaParaXREN = async (
//   req: Request,
//   res: Response
// ) => {
//   // @ts-ignore
//   const prisma = req.prisma as PrismaClient;
//   let pago;
//   try {
//     const { order_id, success } = req.body;
//     const order = await prisma.ordersXREN.findUnique({
//       where: { id: order_id },
//     });
//     if (!order) return res.status(404).json({ error: "Orden no encontrada" });
//     const user = await getUserById(order.user_id, prisma);
//     if (!user) return res.status(404).json({ error: "USUARIO NO ENCONTRADO" });
//     const kyc = await getKycInfoByUser(user.id, prisma);

//     let newOrder;
//     if (success) {
//       if (order?.tipo !== "COMPRA")
//         return res
//           .status(400)
//           .json({ error: "No es una transaccion de compra" });

//       pago = await crearPago(
//         order.user_id,
//         order.amountEUR,
//         "TRANSFERENCIA_BANCARIA",
//         new Date(),
//         `Compra de ${order.unidades} XREN`,
//         prisma
//       );
//       try {
//         const mint = await saleContract.functions.addUsersToVesting(
//           ethers.utils.parseEther(order.unidades.toString()),
//           kyc?.wallet
//         );
//         newOrder = await prisma.ordersXREN.update({
//           where: { id: order.id },
//           data: { hash: mint.hash, status: "PAGO_EXITOSO_ENTREGADO" },
//         });
//       } catch (e) {
//         console.log(e);
//         return res.status(500).json({
//           error:
//             "Error al agregar user a fase, revisa fase de venta y smartcontract",
//         });
//       }

//       await sendWelcomeClub(user.email, `${kyc?.name} ${kyc?.lastname}`);

//       return res.status(200).json({ pago, newOrder });
//     } else {
//       newOrder = await prisma.ordersXREN.update({
//         where: { id: order.id },
//         data: { status: "ERROR_EN_PAGO" },
//       });
//       return res.status(200).json(newOrder);
//     }
//   } catch (error) {
//     console.log(error);
//     await prisma.pagos.delete({ where: { id: pago?.id } });
//     res.status(500).json(error);
//   }
// };
// export const getAllUsersByProject = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { project_id } = req.body;
//     const orders = await prisma.orders.findMany({
//       where: {
//         project_id,
//         tipo: "COMPRA",
//         status: "PAGADO_Y_ENTREGADO_Y_FIRMADO",
//       },
//     });

//     let data = [];
//     for (let order of orders) {
//       const user = await getUserById(order.user_id, prisma);
//       data.push({
//         userId: order.user_id,
//         userName: user?.userName,
//         email: user?.email,
//         referrallFriend: user?.referallFriend,
//         newsletter: user?.newsletter,
//       });
//     }
//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// ///funciones de super admin
// ///Crear un nuevo admin
// export const changeRolUser = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { user_id, rol } = req.body;
//     const usuario = await getUserById(user_id, prisma);
//     let data;
//     if (!usuario)
//       return res.status(404).json({ error: "Usuario no encontrado" });
//     data = await updateUser(user_id, { userRol: rol }, prisma);
//     return res.json(data);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };

// //// VISTA DE LA GESTION XREN
// export const getGestionVentaXREN = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const gestionXREN = await prisma.gestionXREN.findFirst();
//     return res.json(gestionXREN);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ error: e });
//   }
// };
// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { users_id } = req.body;
//     let deletes = [];
//     for (let user_id of users_id) {
//       const user = await getUserById(user_id, prisma);
//       if (!user) continue;
//       const kyc = await getKycInfoByUser(user.id, prisma);
//       if (kyc) continue;

//       deletes.push(await prisma.user.delete({ where: { id: user_id } }));
//     }
//     res.json(deletes);
//   } catch (error) {
//     console.log(error);
//     res.json(error);
//   }
// };

// ///new project to admin esto va a hacer un post

// export const getProjectToAdmin = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { projectId } = req.body;
//     let data;
//     let escenario,
//       fechas,
//       cuenta,
//       keyImagenes,
//       userSale = [];
//     const project = await prisma.projects.findUnique({
//       where: { id: projectId },
//     });
//     if (!project)
//       return res.status(400).json({ error: "Proyecto no encontrado" });
//     const users = await getAllUsers(prisma);
//     const orders = await prisma.orders.findMany({
//       where: { id: project.id, status: "PAGADO_Y_ENTREGADO_Y_FIRMADO" },
//     });
//     escenario = await prisma.escenario_economico.findMany({
//       where: { project_id: project.id },
//     });
//     fechas = await prisma.gestion_fechas.findMany({
//       where: { project_id: project.id },
//     });
//     if (project.cuenta_id) {
//       cuenta = await prisma.cuentas.findUnique({
//         where: { id: project.cuenta_id },
//       });
//     }
//     userSale = await prisma.userManage.findMany({
//       where: { project_id: project.id },
//     });
//     keyImagenes = await prisma.projectImages.findMany({
//       where: { project_id: project.id },
//     });
//     let imagenes = [];
//     for (let key of keyImagenes) {
//       const ruta = await getImage(key.path);
//       imagenes.push({
//         rol: key.rol,
//         id: key.id,
//         path: ruta,
//       });
//     }
//     let favsUser = [];
//     for (let user of users) {
//       if (user.favoritos.includes(project.id)) {
//         favsUser.push({
//           username: user.userName,
//           email: user.email,
//         });
//       }
//     }
//     let investors = [];
//     for (let order of orders) {
//       const user = await getUserById(order.user_id, prisma);
//       investors.push({
//         userId: order.user_id,
//         email: user?.email,
//         newsletter: user?.newsletter,
//         cantidad: order.cantidad,
//         fecha: order.fecha,
//       });
//     }
//     const documentos = await prisma.projectDocs.findMany({
//       where: {
//         project_id: project.id,
//       },
//     });

//     const docs = await Promise.all(
//       documentos.map(async (doc) => ({
//         id: doc.id,
//         rol: doc.rol,
//         visible: doc.visible,
//         user_rol_visible: doc.user_rol_visible,
//         path: await getDoc(doc.path),
//       }))
//     );

//     data = {
//       project,
//       escenario,
//       fechas,
//       cuenta,
//       imagenes,
//       userSale,
//       investors,
//       favsUser,
//       docs,
//     };

//     return res.json(data);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };

// export const getProjectToUser = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { projectId } = req.body;
//     // @ts-ignore
//     const USER = req.user as User;

//     let data;
//     let escenario,
//       fechas,
//       cuenta,
//       keyImagenes,
//       userSale = [];
//     const project = await prisma.projects.findUnique({
//       where: { id: projectId },
//     });
//     if (!project)
//       return res.status(400).json({ error: "Proyecto no encontrado" });
//     const user = await getUserById(USER.id, prisma);
//     if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
//     const orders = await prisma.orders.findMany({
//       where: { id: project.id, status: "PAGADO_Y_ENTREGADO_Y_FIRMADO" },
//     });
//     escenario = await prisma.escenario_economico.findMany({
//       where: { project_id: project.id },
//     });
//     fechas = await prisma.gestion_fechas.findMany({
//       where: { project_id: project.id },
//     });
//     if (project.cuenta_id) {
//       cuenta = await prisma.cuentas.findUnique({
//         where: { id: project.cuenta_id },
//       });
//     }
//     userSale = await prisma.userManage.findMany({
//       where: { project_id: project.id },
//     });
//     keyImagenes = await prisma.projectImages.findMany({
//       where: { project_id: project.id },
//     });
//     const kyc = await getKycInfoByUser(USER.id, prisma);
//     let imagenes = [];
//     for (let key of keyImagenes) {
//       const ruta = await getImage(key.path);
//       imagenes.push({
//         rol: key.rol,
//         id: key.id,
//         path: ruta,
//       });
//     }
//     let nftsDB,
//       nfts = [];

//     const documentosClient = await prisma.projectDocs.findMany({
//       where: {
//         project_id: project.id,
//         visible: true,
//         user_rol_visible: "CLIENT",
//       },
//     });

//     let documentos: any[] = [];
//     let owner;
//     if (user?.kycStatus === "APROBADO") {
//       const documentosKyc = await prisma.projectDocs.findMany({
//         where: {
//           visible: true,
//           user_rol_visible: "KYC",
//           project_id: project.id,
//         },
//       });

//       owner = await prisma.orders.findFirst({
//         where: {
//           user_id: user.id,
//           status: "PAGADO_Y_ENTREGADO_Y_FIRMADO",
//           project_id: project.id,
//         },
//       });
//       nftsDB = await prisma.nFT.findMany({
//         where: { owner_id: USER.id, project_id: project.id },
//       });
//       for (let nft of nftsDB) {
//         let owner = await xperiendNFT.ownerOf(nft.id);
//         if (owner == kyc?.wallet) {
//           nfts.push(nft);
//         }
//       }

//       const documentosOwner = owner
//         ? await prisma.projectDocs.findMany({
//             where: {
//               visible: true,
//               user_rol_visible: "OWNER",
//               project_id: project.id,
//             },
//           })
//         : [];

//       documentos = owner
//         ? documentosClient.concat(documentosKyc, documentosOwner)
//         : documentosKyc.concat(documentosClient);
//     } else {
//       documentos = documentosClient;
//     }
//     const docs = await Promise.all(
//       documentos.map(async (doc) => ({
//         id: doc.id,
//         rol: doc.rol,
//         visible: doc.visible,
//         user_rol_visible: doc.user_rol_visible,
//         path: await getDoc(doc.path),
//       }))
//     );

//     data = {
//       project,
//       escenario,
//       fechas,
//       cuenta,
//       imagenes,
//       userSale,
//       docs,
//       owner: owner ? true : false,
//       nfts,
//     };

//     return res.json(data);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };

// export const getProjectPublic = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { projectId } = req.body;

//     let data;
//     let escenario,
//       fechas,
//       cuenta,
//       keyImagenes,
//       userSale = [];
//     const project = await prisma.projects.findUnique({
//       where: { id: projectId },
//     });
//     if (!project)
//       return res.status(400).json({ error: "Proyecto no encontrado" });
//     const orders = await prisma.orders.findMany({
//       where: { id: project.id, status: "PAGADO_Y_ENTREGADO_Y_FIRMADO" },
//     });
//     escenario = await prisma.escenario_economico.findMany({
//       where: { project_id: project.id },
//     });
//     fechas = await prisma.gestion_fechas.findMany({
//       where: { project_id: project.id },
//     });
//     if (project.cuenta_id) {
//       cuenta = await prisma.cuentas.findUnique({
//         where: { id: project.cuenta_id },
//       });
//     }
//     userSale = await prisma.userManage.findMany({
//       where: { project_id: project.id },
//     });
//     keyImagenes = await prisma.projectImages.findMany({
//       where: { project_id: project.id },
//     });
//     let imagenes = [];
//     for (let key of keyImagenes) {
//       const ruta = await getImage(key.path);
//       imagenes.push({
//         rol: key.rol,
//         id: key.id,
//         path: ruta,
//       });
//     }

//     data = {
//       project,
//       escenario,
//       fechas,
//       cuenta,
//       imagenes,
//       userSale,
//     };

//     return res.json(data);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ error: e });
//   }
// };

// export const terminarReclamacion = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { order_id, complete_at, reference_number } = req.body;
//     const order = await getOrderById(order_id, prisma);
//     if (
//       !order ||
//       order.status != "FIRMADO_POR_ENTREGAR" ||
//       order.tipo != "RECLAMACION"
//     )
//       return res.status(404).json({ error: "Orden no encontrada" });
//     const user = await getUserById(order.user_id, prisma);
//     if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
//     const endClaim = await xperiendNFT.endClaim(order.nft_id[0]);
//     const updated = await updateOrder(
//       order_id,
//       {
//         status: "PAGADO_Y_ENTREGADO_Y_FIRMADO",
//         complete_at: new Date(complete_at),
//         reference_number,
//       },
//       prisma
//     );
//     await prisma.nFT.delete({ where: { id: order.nft_id[0] } });
//     await reclamacionRealizada(
//       user.email,
//       user.userName ? user.userName : "usuario"
//     );
//     res.json({ endClaim, updated });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// export const cancelarReclamacion = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { order_id, complete_at } = req.body;
//     const order = await getOrderById(order_id, prisma);
//     if (
//       !order ||
//       order.status != "FIRMADO_POR_ENTREGAR" ||
//       order.tipo != "RECLAMACION"
//     )
//       return res.status(404).json({ error: "Orden no encontrada" });
//     const cancelClaim = await xperiendNFT.cancelClaim(order.nft_id[0]);
//     const updated = await updateOrder(
//       order_id,
//       { status: "PAGO_CANCELADO", complete_at },
//       prisma
//     );
//     res.json({ cancelClaim, updated });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };
// export const terminarReinversion = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { order_id, complete_at, reference_number } = req.body;
//     const order = await getOrderById(order_id, prisma);
//     if (
//       !order ||
//       order.status != "FIRMADO_POR_ENTREGAR" ||
//       order.tipo != "REINVERSION"
//     )
//       return res.status(404).json({ error: "Orden no encontrada" });
//     const user = await getUserById(order.user_id, prisma);
//     if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
//     const endReinvest = await xperiendNFT.endReinvest(order.nft_id[0]);
//     const updated = await updateOrder(
//       order_id,
//       {
//         status: "PAGADO_Y_ENTREGADO_Y_FIRMADO",
//         complete_at: new Date(complete_at),
//         reference_number,
//       },
//       prisma
//     );
//     await prisma.nFT.delete({ where: { id: order.nft_id[0] } });
//     await reinversionRealizada(
//       user.email,
//       user.userName ? user.userName : "usuario"
//     );
//     res.json({ endReinvest, updated });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// export const cancelarReinversion = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//     const { order_id, complete_at } = req.body;
//     const order = await getOrderById(order_id, prisma);
//     if (
//       !order ||
//       order.status != "FIRMADO_POR_ENTREGAR" ||
//       order.tipo != "REINVERSION"
//     )
//       return res.status(404).json({ error: "Orden no encontrada" });
//     const cancelReinvest = await xperiendNFT.cancelReinvest(order.nft_id[0]);
//     const updated = await updateOrder(
//       order_id,
//       { status: "PAGO_CANCELADO", complete_at: new Date(complete_at) },
//       prisma
//     );
//     res.json({ cancelReinvest, updated });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };
