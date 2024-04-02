import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

import { getAllUsers, getUserById, updateUser } from "../service/user";
import {
  createPriceFormat,
  updateDesignService,
  updatePriceFormat,
} from "../service/designs";

import { sendWelcomeEmail } from "../service/mail";
import { getImage } from "../service/aws";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    // const USER= req.user as User;
    let data = [],
      image;
    const users = await getAllUsers(prisma);
    for (let user of users) {
      let profile = await prisma.userProfile.findUnique({
        where: { user_id: user.id },
      });
      if (profile?.foto_de_perfil) {
        image = await getImage(profile.foto_de_perfil);
      }
      data.push({ user, profile, image });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteUSer = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    // const USER= req.user as User;
    const { user_id } = req.body;
    const profile = await prisma.userProfile.findUnique({ where: { user_id } });
    const designRequest = await prisma.designRequest.findMany({
      where: { request_user: user_id },
    });
    if (profile) await prisma.userProfile.delete({ where: { user_id } });
    if (designRequest)
      await prisma.designRequest.deleteMany({
        where: { request_user: user_id },
      });
    let data = await prisma.user.delete({ where: { id: user_id } });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const salt = bcrypt.genSaltSync();
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    // const USER= req.user as User;
    const { email, password, firstname, lastname, userol } = req.body;
    const data = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt),
        firstname,
        lastname,
        userol,
      },
    });
    await sendWelcomeEmail(email, `${firstname} ${lastname}`);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const updateDesign = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    // const USER= req.user as User;
    const { design_id, delivery_date, status } = req.body;
    const data = await updateDesignService(
      design_id,
      { delivery_date, status },
      prisma
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const createPriceToFormats = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const {
      formato,
      price,
      priceInstagram,
      priceTiktok,
      priceSnap,
      priceRoblox,
      priceZepeto,
    } = req.body;
    let data = await prisma.priceFormato.findUnique({ where: { formato } });
    if (data) {
      data = await updatePriceFormat(
        data.id,
        {
          price,
          priceInstagram,
          priceTiktok,
          priceSnap,
          priceRoblox,
          priceZepeto,
        },
        prisma
      );
    } else {
      data = await createPriceFormat(
        {
          formato,
          price,
          priceInstagram,
          priceTiktok,
          priceSnap,
          priceRoblox,
          priceZepeto,
        },
        prisma
      );
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
