import { PrismaClient } from "@prisma/client";

export const getUserById = async (id: number, prisma: PrismaClient) => {
  return await prisma.user.findUnique({
    where: { id: id },
  });
};

export const getAllUsers = async (prisma: PrismaClient) => {
  return await prisma.user.findMany();
};

export const getUserByEmail = async (email: string, prisma: PrismaClient) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const updateUser = async (
  id: number,
  data: {
    email?: string;
    password?: string;
    authToken?: string;
    firstname?: string;
    lastname?: string;
  },
  prisma: PrismaClient
) => {
  return await prisma.user.update({
    where: { id: id },
    data: {
      ...data,
    },
  });
};

export const updateUserProfile = async (
  id: number,
  data: {
    foto_de_perfil?: string;
    domicilio?: string;
    postal_code?: string;
    country?: string;
    cif?: string;
    nombre_empresa?: string;
  },
  prisma: PrismaClient
) => {
  return await prisma.userProfile.update({
    where: { user_id: id },
    data: {
      ...data,
    },
  });
};

export const createUserProfile = async (
  data: {
    user_id: number;
    foto_de_perfil: string;
    domicilio: string;
    postal_code: string;
    country: string;
    cif?: string;
    nombre_empresa?: string;
  },
  prisma: PrismaClient
) => {
  return await prisma.userProfile.create({
    data: {
      ...data,
    },
  });
};
