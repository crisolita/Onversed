import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

import { getAllUsers, getUserById, updateUser } from "../service/user";
import {
  createPriceFormat,
  updateDesignService,
  updatePriceFormat,
} from "../service/designs";

import {
  agradecimiento,
  confirmAndValidateLastArt,
  confirmContentAndDeliveryDate,
  faltaDeInfoEmail,
  linkValidarDesign,
  sendWelcomeEmail,
} from "../service/mail";
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
export const updateDesignStatus = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    // const USER= req.user as User;
    const { design_id, status } = req.body;
    const data = await updateDesignService(design_id, { status }, prisma);
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
    const { formato, price } = req.body;
    let data = await prisma.priceFormato.findUnique({ where: { formato } });
    if (data) {
      data = await updatePriceFormat(
        data.id,
        {
          price,
        },
        prisma
      );
    } else {
      data = await createPriceFormat(
        {
          formato,
          price,
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
export const sendConfirmOrFaltaDeInfo = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    // const USER= req.user as User;
    const { design_id, delivery_date, infoFaltante } = req.body;
    const design = await prisma.designRequest.findUnique({
      where: { id: design_id },
    });
    if (!design || !design.request_user || design.status !== "ENVIADO")
      return res.status(400).json({ error: "Diseño no encontrado" });
    const client = await getUserById(design.request_user, prisma);
    if (!client)
      return res
        .status(400)
        .json({ error: "Client en design request invalido" });
    let data;
    if (delivery_date) {
      await confirmContentAndDeliveryDate(
        client?.email,
        `${client?.firstname} ${client?.lastname}`,
        new Date(delivery_date).toDateString()
      );
      data = await updateDesignService(
        design.id,
        { delivery_date: new Date(delivery_date), status: "EN_PROCESO" },
        prisma
      );
      return res.json(data);
    } else if (infoFaltante) {
      await faltaDeInfoEmail(
        client.email,
        `${client?.firstname} ${client?.lastname}`,
        infoFaltante
      );
      return res.json({ data: "Enviado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const sendLinkToUser = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    // const USER= req.user as User;
    const { design_id, link } = req.body;
    const design = await prisma.designRequest.findUnique({
      where: { id: design_id },
    });
    if (!design || !design.request_user)
      return res.status(400).json({ error: "Diseño no encontrado" });
    if (design.status != "EN_PROCESO" && design.status != "REVISION")
      return res
        .status(400)
        .json({ error: "No esta en estado de revision o en proceso" });
    const client = await getUserById(design.request_user, prisma);
    if (!client)
      return res
        .status(400)
        .json({ error: "Client en design request invalido" });
    let data;
    await linkValidarDesign(
      client.email,
      `${client?.firstname} ${client?.lastname}`,
      link
    );
    data = await updateDesignService(design.id, { status: "REVISION" }, prisma);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const sendThanks = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    // const USER= req.user as User;
    const { design_id, indicadores } = req.body;
    const design = await prisma.designRequest.findUnique({
      where: { id: design_id },
    });
    if (!design || !design.request_user || design.status !== "FINALIZADO")
      return res.status(400).json({ error: "Diseño no encontrado" });
    const client = await getUserById(design.request_user, prisma);
    if (!client)
      return res
        .status(400)
        .json({ error: "Client en design request invalido" });
    let data;
    await agradecimiento(
      client.email,
      `${client.firstname} ${client.lastname}`,
      indicadores
    );
    data = await updateDesignService(
      design.id,
      { status: "ENTREGADO" },
      prisma
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const sendConfirmLastArt = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    // const USER= req.user as User;
    const { design_id, delivery_date } = req.body;
    const design = await prisma.designRequest.findUnique({
      where: { id: design_id },
    });
    if (!design || !design.request_user || design.status !== "REVISION")
      return res.status(400).json({ error: "Diseño no encontrado" });
    const client = await getUserById(design.request_user, prisma);
    if (!client)
      return res
        .status(400)
        .json({ error: "Client en design request invalido" });
    let data;
    await confirmAndValidateLastArt(
      client.email,
      `${client.firstname} ${client.lastname}`,
      new Date(delivery_date).toDateString()
    );
    data = await updateDesignService(
      design.id,
      { status: "FINALIZADO" },
      prisma
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getAllPagos = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    // const USER= req.user as User;
    let data = await prisma.pago.findMany();

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
