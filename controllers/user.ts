import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/utils";
import {
  createUserProfile,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
  updateUserProfile,
} from "../service/user";

import { getImage, uploadImage } from "../service/aws";
import { sendAuthEmail, sendWelcomeEmail } from "../service/mail";

export const userRegisterController = async (req: Request, res: Response) => {
  try {
    const salt = bcrypt.genSaltSync();
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email, password, firstname, lastname } = req?.body;
    const user = await getUserByEmail(email, prisma);

    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          email: email,
          password: bcrypt.hashSync(password, salt),
          userol: "CLIENT",
          firstname,
          lastname,
        },
      });
      await sendWelcomeEmail(email, `${firstname} ${lastname}`);
      res
        .status(200)
        .json({ email, userol: newUser.userol, firstname, lastname });
    } else {
      res.status(400).json({ error: "Email ya registrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getAuthCode = async (req: Request, res: Response) => {
  try {
    let authCode = JSON.stringify(
      Math.round(Math.random() * (999999 - 100000) + 100000)
    );
    const salt = bcrypt.genSaltSync();
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email, password } = req?.body;
    const user = await getUserByEmail(email, prisma);
    if (user && user.password && bcrypt.compareSync(password, user.password)) {
      await sendAuthEmail(email, authCode);
      await updateUser(
        user.id,
        { authToken: bcrypt.hashSync(authCode, salt) },
        prisma
      );
      return res.status(200).json({
        data: `Se ha enviado código de validación al correo: ${email}`,
      });
    } else {
      res.status(400).json({ error: "Email o contraaseña incorrectos" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const userLoginController = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email, authCode } = req?.body;
    const user = await getUserByEmail(email, prisma);
    if (user) {
      if (bcrypt.compareSync(authCode, user.authToken ? user.authToken : ""))
        return res.status(200).json({
          email: user.email,
          userid: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          token: createJWT(user),
          userol: user.userol,
        });
      else return res.status(403).json({ error: "Token auth incorrecto." });
    } else {
      return res.status(400).json({ error: "Email incorrecto" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const getRecoveryCode = async (req: Request, res: Response) => {
  try {
    let authCode = JSON.stringify(
      Math.round(Math.random() * (999999 - 100000) + 100000)
    );
    const salt = bcrypt.genSaltSync();
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email } = req?.body;
    const user = await getUserByEmail(email, prisma);
    if (user) {
      await sendAuthEmail(email, authCode);
      await updateUser(
        user.id,
        { authToken: bcrypt.hashSync(authCode, salt) },
        prisma
      );
      return res.status(200).json({
        data: `Se ha enviado código de validación al correo: ${email}`,
      });
    } else {
      res.status(400).json({ error: "Email incorrecto" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { newPassword, authCode, email } = req?.body;
    const user = await getUserByEmail(email, prisma);
    if (user) {
      if (bcrypt.compareSync(authCode, user.authToken ? user.authToken : "")) {
        const salt = bcrypt.genSaltSync();
        await updateUser(
          user.id,
          { password: bcrypt.hashSync(newPassword, salt) },
          prisma
        );
        return res.status(200).json({ data: "Contraseña cambiada con exito!" });
      } else return res.status(400).json({ error: "Token 2fa incorrecto." });
    } else {
      return res.status(404).json({ error: "Usuario no existe." });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
export const handleImageUpload = async (base64Image: string, path: string) => {
  const data = Buffer.from(base64Image, "base64");
  console.log("VOy a su");
  await uploadImage(data, path);
};
export const userEditProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const foto_de_perfil = req.file?.buffer;
    const {
      firstname,
      lastname,
      domicilio,
      postal_code,
      country,
      cif,
      nombre_empresa,
      user_id,
    } = req?.body;
    let user = await getUserById(USER.id, prisma);

    if (user?.userol == "ADMIN" && user_id) {
      user = await getUserById(user_id, prisma);
    }

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    const userInfo = await prisma.userProfile.findUnique({
      where: { user_id: user.id },
    });
    if (firstname && lastname) {
      user = await updateUser(
        user.id,
        {
          firstname,
          lastname,
        },
        prisma
      );
    }
    let profile;

    if (userInfo) {
      console.log("hola voy a actualizar");

      profile = await updateUserProfile(
        user.id,
        {
          domicilio,
          postal_code,
          country,
          cif,
          nombre_empresa,
        },
        prisma
      );
    } else if (domicilio && postal_code && country && cif) {
      console.log("hola voy a crear");

      profile = await createUserProfile(
        {
          user_id: user.id,
          foto_de_perfil: foto_de_perfil
            ? `profile_user_${user.id}`
            : undefined,
          domicilio,
          postal_code,
          country,
          cif,
          nombre_empresa,
        },
        prisma
      );
    } else if (domicilio || postal_code || country || cif) {
      return res.status(400).json({
        error:
          "Para crear informacion de perfil son requeridos todos los campos de facturacion",
      });
    }
    if (foto_de_perfil) {
      console.log("hola voy a subir la foto");

      const profilepath = `profile_user_${user.id}`;
      const base64ImageProfile = foto_de_perfil.toString("base64");
      await handleImageUpload(base64ImageProfile, profilepath);
      profile = await updateUserProfile(
        user.id,
        { foto_de_perfil: profilepath },
        prisma
      );
    }
    res.json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getPagos = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    let user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    let data = await prisma.pago.findMany({ where: { request_user: USER.id } });
    return res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    const userInfo = await prisma.userProfile.findUnique({
      where: { user_id: user.id },
    });
    let foto_de_perfil;
    if (userInfo?.foto_de_perfil) {
      foto_de_perfil = await getImage(userInfo.foto_de_perfil);
    }

    return res.json({
      userInfo,
      email: user.email,
      id: user.id,
      googleId: user.id,
      first_name: user.firstname,
      last_name: user.lastname,
      user_rol: user.userol,
      domicilio: userInfo?.domicilio,
      postal_code: userInfo?.postal_code,
      country: userInfo?.country,
      cif: userInfo?.cif,
      nombre_empresa: userInfo?.nombre_empresa,
      foto_de_perfil,
      token: createJWT(user),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
