import { PrismaClient, STATUSREQUEST } from "@prisma/client";

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
