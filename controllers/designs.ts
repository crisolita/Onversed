import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { handleImageUpload } from "./user";
import { getMedia, uploadMedia } from "../service/aws";
import { getUserById } from "../service/user";
import { createCheckoutSession, validateCheckout } from "../service/stripe";
import { updateDesign } from "./backoffice";
import { updateDesignService } from "../service/designs";
import { sendResponseSolicitud } from "../service/mail";

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
      data: { name, description },
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
      redes,
      metaverso,
      model_nft,
      action,
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

    let unique, SKU;
    SKU = uuidv4();
    console.log("hola");
    while (!unique) {
      console.log("hola aqui dentro");
      SKU = uuidv4();
      unique = await prisma.designRequest.findUnique({ where: { SKU } });
      if (!unique) unique = true;
    }
    let data = await prisma.designRequest.create({
      data: {
        request_user: USER.id,
        name,
        collection_id,
        format,
        otro,
        SKU: SKU,
        redes,
        metaverso,
        model_nft,
        status: "BORRADOR",
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
      ///GENERAR LINK DE PAGO O ENVIARLO? DE DONDE LO SACAMOS?
      //cual es el precio?
      let precioPreliminar = precio.price;
      switch (redes) {
        case "TIKTOK":
          precioPreliminar += precio.priceTiktok ? precio.priceTiktok : 0;
          break;
        case "SNAP":
          precioPreliminar += precio.priceSnap ? precio.priceSnap : 0;
          break;
        case "INSTAGRAM":
          precioPreliminar += precio.priceInstagram ? precio.priceInstagram : 0;

          break;
      }
      switch (metaverso) {
        case "ROBLOX":
          precioPreliminar += precio.priceRoblox ? precio.priceRoblox : 0;
          break;
        case "ZEPETO":
          precioPreliminar += precio.priceZepeto ? precio.priceZepeto : 0;
          break;
      }
      checkout = await createCheckoutSession(
        (precioPreliminar * 100).toString(),
        data.id
      );
      data = await prisma.designRequest.update({
        where: { id: data.id },
        data: {
          status: "PAGO_PENDIENTE",
          price: precioPreliminar,
          checkout_stripe_id: checkout.id,
        },
      });
    }

    return res.json({ data, paymentLink: checkout.url });
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
    const { orderId } = req.body;
    const user = await prisma.user.findUnique({ where: { id: USER.id } });
    let designRequest = await prisma.designRequest.findFirst({
      where: { id: orderId, request_user: USER.id },
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
    const data = await prisma.collections.findMany();
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
