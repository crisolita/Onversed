import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { handleImageUpload } from "./user";
import { getMedia, uploadMedia } from "../service/aws";
import { getUserById } from "../service/user";

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
    if (action == "VENTA") {
      ///GENERAR LINK DE PAGO O ENVIARLO? DE DONDE LO SACAMOS?
      data = await prisma.designRequest.update({
        where: { id: data.id },
        data: { status: "PAGO_PENDIENTE" },
      });
    }

    return res.json(data);
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
