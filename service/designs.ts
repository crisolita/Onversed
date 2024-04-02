import { FormatDesign, PrismaClient, STATUSREQUEST } from "@prisma/client";

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
