import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { handleImageUpload } from "./user";

export const createCollection = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient; // @ts-ignore
    const USER = req.user as User;
    const { name, description } = req.body;
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

    let unique, SKU;
    SKU = uuidv4();
    while (!unique) {
      SKU = uuidv4();
      unique = await prisma.designRequest.findUnique({ where: { SKU } });
    }
    const data = await prisma.designRequest.create({
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
        status: action,
      },
    });

    // if (media) {
    //   console.log("hola voy a subir la foto");

    //   const mediaPath = `media_${data.id}_${SKU}`;
    //   const base64ImageProfile = media.toString("base64");
    //   await handleImageUpload(base64ImageProfile, mediaPath);
    // }

    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
