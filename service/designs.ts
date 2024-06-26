import {
  FormatDesign,
  PRENDA,
  PRODUCTO,
  PrismaClient,
  STATUSREQUEST,
} from "@prisma/client";

export const updateDesignService = async (
  id: number,
  data: {
    delivery_date?: Date;
    status?: STATUSREQUEST;
  },
  prisma: PrismaClient
) => {
  return await prisma.designRequest.update({
    where: { id: id },
    data: {
      ...data,
    },
  });
};
export const updatePriceFormat = async (
  id: number,
  data: {
    price?: number;
    priceInstagram?: number;
    priceTiktok?: number;
    priceSnap?: number;
    priceRoblox?: number;
    priceZepeto?: number;
  },
  prisma: PrismaClient
) => {
  return await prisma.priceFormato.update({
    where: { id: id },
    data: {
      ...data,
    },
  });
};
export const createPriceFormat = async (
  data: {
    formato: FormatDesign;
    price: number;
    priceInstagram?: number;
    priceTiktok?: number;
    priceSnap?: number;
    priceRoblox?: number;
    priceZepeto?: number;
  },
  prisma: PrismaClient
) => {
  return await prisma.priceFormato.create({
    data: {
      ...data,
    },
  });
};
export const updatePriceProducto = async (
  id: number,
  data: {
    price?: number;
  },
  prisma: PrismaClient
) => {
  return await prisma.priceProducto.update({
    where: { id: id },
    data: {
      ...data,
    },
  });
};
export const createPriceProducto = async (
  data: {
    producto: PRODUCTO;
    price: number;
  },
  prisma: PrismaClient
) => {
  return await prisma.priceProducto.create({
    data: {
      ...data,
    },
  });
};

export const updateDrawDesign = async (
  id: number,
  data: {
    name?: string;
    SKU?: string;
    format?: FormatDesign;
    otro?: string;
    otra_prenda?: string;
    prenda?: PRENDA;
  },
  prisma: PrismaClient
) => {
  return await prisma.designRequest.update({
    where: { id: id },
    data: {
      ...data,
    },
  });
};
