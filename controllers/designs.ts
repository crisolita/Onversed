import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { handleImageUpload } from "./user";
import { getMedia, uploadMedia } from "../service/aws";
import { getUserById } from "../service/user";
import { createCheckoutSession, validateCheckout } from "../service/stripe";
import { updateDesignService } from "../service/designs";
import {
  avisarAdminCambiosEnDesign,
  avisarAdminNuevoDiseñoYaPagado,
  avisarAdminValidacionDeDiseño,
  confirmAndValidateLastArt,
  noConfirmAndChanges,
  sendResponseSolicitud,
} from "../service/mail";

export const createCollection = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient; // @ts-ignore
    const USER = req.user as User;
    const { name, description } = req.body;
    const profile = await prisma.userProfile.findUnique({
      where: { user_id: USER.id },
    });
    if (!profile)
      return res
        .status(400)
        .json({ error: "Usuario sin perfil no puede crear coleccion" });
    const data = await prisma.collections.create({
      data: { name, description, owner_id: USER.id },
    });
    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const createRequestDesign = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient; // @ts-ignore
    const USER = req.user as User;
    const {
      name,
      collection_id,
      format,
      otro,
      model_nft,
      action,
      medialinkexternal,
      producto,
      SKU,
    } = req.body;
    const media = req.file?.buffer;
    const type = req.file?.mimetype;
    const profile = await prisma.userProfile.findUnique({
      where: { user_id: USER.id },
    });
    if (!profile)
      return res
        .status(400)
        .json({ error: "Usuario sin perfil no puede crear coleccion" });
    let precio = await prisma.priceFormato.findUnique({
      where: { formato: format },
    });
    if (!precio)
      return res
        .status(400)
        .json({ error: "No hay precio establecido para este formato" });

    let unique = await prisma.designRequest.findUnique({ where: { SKU } });
    if (unique) return res.status(400).json({ error: "SKU ya existe" });
    let data = await prisma.designRequest.create({
      data: {
        request_user: USER.id,
        name,
        collection_id,
        format,
        otro,
        SKU,
        model_nft,
        status: "BORRADOR",
        productType: producto,
        mediaLinkExternalFile: medialinkexternal,
      },
    });

    if (media && type) {
      console.log(type.split("/")[1]);
      const mediaPath = `media_${data.id}_${SKU}.${type.split("/")[1]}`;
      const base64Media = media.toString("base64");
      const anotherData = Buffer.from(base64Media, "base64");
      await uploadMedia(anotherData, mediaPath);
      await prisma.designRequest.update({
        where: { id: data.id },
        data: { mediaPath },
      });
    }
    let checkout;
    if (action == "VENTA") {
      console.log("ENtrre aqui?");
      ///GENERAR LINK DE PAGO O ENVIARLO? DE DONDE LO SACAMOS?
      //cual es el precio?
      let precioPreliminar = precio.price;
      if (data.productType) {
        const priceOfProduct = await prisma.priceProducto.findUnique({
          where: { producto: data.productType },
        });
        precioPreliminar += priceOfProduct?.price ? priceOfProduct.price : 0;
      }
      checkout = await createCheckoutSession(
        (precioPreliminar * 100).toString(),
        data.id
      );
      console.log("o aki?", checkout, "check");
      if (!checkout)
        return res.status(500).json({ error: "Pago con tarjeta ha fallado" });
      data = await prisma.designRequest.update({
        where: { id: data.id },
        data: {
          status: "PAGO_PENDIENTE",
          price: precioPreliminar,
          checkout_stripe_id: checkout.id,
        },
      });
    }
    console.log(data, "dtaa");
    return res.json({ data, paymentLink: checkout ? checkout.url : "" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const confirmPayOfRequestDesign = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient; // @ts-ignore
    const USER = req.user as User;
    const { design_id } = req.body;
    const user = await prisma.user.findUnique({ where: { id: USER.id } });
    let designRequest = await prisma.designRequest.findFirst({
      where: { id: design_id, request_user: USER.id },
    });
    if (!designRequest || !designRequest.price)
      return res
        .status(400)
        .json({ error: "Peticion de diseño no encontrada" });
    let pago;
    if (
      designRequest.checkout_stripe_id &&
      designRequest.status == "PAGO_PENDIENTE"
    ) {
      const paid = await validateCheckout(designRequest.checkout_stripe_id);
      if (paid.payment_status == "paid") {
        pago = await prisma.pago.create({
          data: {
            request_user: USER.id,
            desing_id: designRequest.id,
            amount: designRequest.price,
            checkout_id: designRequest.checkout_stripe_id,
            date: new Date(),
          },
        });

        designRequest = await updateDesignService(
          designRequest.id,
          { status: "ENVIADO" },
          prisma
        );
        await avisarAdminNuevoDiseñoYaPagado(
          designRequest.id,
          `${user?.firstname} ${user?.lastname}`,
          designRequest.price ? designRequest.price : 0,
          designRequest.format
        );
        await sendResponseSolicitud(
          USER.email,
          `${user?.firstname} ${user?.lastname}`
        );
        return res.json(designRequest);
      } else {
        return res.status(400).json({ error: "No ha pagado" });
      }
    } else {
      return res.status(400).json({ error: "Orden de pago no ha sido creada" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const getCollections = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient; // @ts-ignore
    const USER = req.user as User;
    const data = await prisma.collections.findMany({
      where: { owner_id: USER.id },
    });
    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const getDesignsRequested = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient; // @ts-ignore
    const USER = req.user as User;
    let data = [],
      designs = [];
    const user = await getUserById(USER.id, prisma);
    if (user?.userol == "ADMIN") {
      designs = await prisma.designRequest.findMany();
    } else {
      designs = await prisma.designRequest.findMany({
        where: { request_user: USER.id },
      });
    }
    for (let design of designs) {
      if (design.mediaPath) {
        const media = await getMedia(design.mediaPath);
        data.push({ design, media });
      } else {
        data.push(design);
      }
    }
    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const confirmOrChangeDesign = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient; // @ts-ignore
    const USER = req.user as User;
    const user = await getUserById(USER.id, prisma);
    const { design_id, changes } = req.body;
    const desing = await prisma.designRequest.findUnique({
      where: { id: design_id },
    });
    if (
      !desing ||
      desing?.request_user != user?.id ||
      desing.status != "REVISION"
    )
      return res.status(400).json({ error: "Diseño no encontrado" });
    if (changes) {
      await noConfirmAndChanges(
        user.email,
        `${user.firstname} ${user.lastname}`
      );
      ///enviar al admin
      await avisarAdminCambiosEnDesign(design_id, changes);
      return res.json({ data: "Cambios enviados" });
    } else {
      /// ENIVAR AL ADMIN QUE ACEPTO
      await avisarAdminValidacionDeDiseño(
        design_id,
        `${user.firstname} ${user.lastname}`
      );
    }
    return res.json({ data: "Hemos avisado tu confirmacion al admin" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const sendDrawDesignController = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient; // @ts-ignore
    const USER = req.user as User;
    const { design_id, action = "VENTA" } = req.body;
    const profile = await prisma.userProfile.findUnique({
      where: { user_id: USER.id },
    });
    if (!profile)
      return res
        .status(400)
        .json({ error: "Usuario sin perfil no puede crear coleccion" });
    let design = await prisma.designRequest.findUnique({
      where: { id: design_id },
    });
    if (!design || design.status != "BORRADOR")
      return res.status(400).json({ error: "Diseño no encontrado" });
    let precio = await prisma.priceFormato.findUnique({
      where: { formato: design?.format },
    });

    if (!precio)
      return res
        .status(400)
        .json({ error: "No hay precio establecido para este formato" });

    let checkout;
    if (action == "VENTA") {
      console.log("ENtrre aqui?");
      ///GENERAR LINK DE PAGO O ENVIARLO? DE DONDE LO SACAMOS?
      //cual es el precio?
      let precioPreliminar = precio.price;
      if (design.productType) {
        const priceOfProduct = await prisma.priceProducto.findUnique({
          where: { producto: design.productType },
        });
        precioPreliminar += priceOfProduct?.price ? priceOfProduct.price : 0;
      }
      checkout = await createCheckoutSession(
        (precioPreliminar * 100).toString(),
        design.id
      );
      console.log("o aki?", checkout, "check");
      if (!checkout)
        return res.status(500).json({ error: "Pago con tarjeta ha fallado" });
      design = await prisma.designRequest.update({
        where: { id: design.id },
        data: {
          status: "PAGO_PENDIENTE",
          price: precioPreliminar,
          checkout_stripe_id: checkout.id,
        },
      });
    }

    return res.json({ design, paymentLink: checkout.url });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
