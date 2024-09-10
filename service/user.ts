import { PrismaClient, UserRol } from "@prisma/client";

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
export const getUserByGoogleID = async (googleID: string, prisma: PrismaClient) => {
  return await prisma.user.findUnique({
    where: { googleID:googleID },
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
    municipio?: string;
    provincia?: string;
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
    foto_de_perfil?: string;
    domicilio: string;
    postal_code: string;
    country: string;
    municipio?: string;
    provincia?: string;
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

export const createUser = async (
  data: { email: string; password?: string, firstname:string,googleID?:string, lastname:string,userol:UserRol,validated?:boolean},
  prisma: PrismaClient
) => {
  return await prisma.user.create({
   data:{...data}
  });
};