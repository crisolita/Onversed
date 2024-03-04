import { EstadoPagoYFirma, PrismaClient } from "@prisma/client";
import { StakeContract, XRENContract, saleContract } from "./web3";
import { ethers } from "ethers";
import { getProjectById } from "./backoffice";

export const getGestionByProjectId = async (
  id: number,
  prisma: PrismaClient
) => {
  return await prisma.gestion_fechas.findUnique({
    where: { project_id: id },
  });
};
export const getCuentaById = async (id: number, prisma: PrismaClient) => {
  return await prisma.cuentas.findUnique({
    where: { id: id },
  });
};
export const getOrderById = async (id: number, prisma: PrismaClient) => {
  return await prisma.orders.findUnique({
    where: { id: id },
  });
};
export const updateFechas = async (
  id: number,
  data: {
    fecha_inicio_reinversion?: Date;
    fecha_fin_reinversion?: Date;
    fecha_reclamo?: Date;
    fecha_inicio_intercambio?: Date;
    fecha_fin_intercambio?: Date;
    visible_user?: boolean;
    visible_premium?: boolean;
    visible_gold?: boolean;
  },
  prisma: PrismaClient
) => {
  return await prisma.gestion_fechas.update({
    where: { project_id: Number(id) },
    data: {
      ...data,
    },
  });
};
export const updateOrder = async (
  id: number,
  data: {
    document_id?: string;
    status?: EstadoPagoYFirma;
    nft_id?: number[];
    cantidad?: number;
    url_sign?: string;
    checkout_id?: string;
    complete_at?: Date;
    reference_number?: string;
    fecha_devolucion?: Date;
    exchange_receiver?: number;
    info_devolucion?: string;
  },
  prisma: PrismaClient
) => {
  return await prisma.orders.update({
    where: { id: Number(id) },
    data: {
      ...data,
    },
  });
};
export const updateProject = async (
  id: number,
  data: {
    cuenta_id?: number;
    cantidadInicial?: number;
    cantidadRestante?: number;
    precio_unitario?: number;
    beneficioPorNFT?: number;
    proyectoReinversion?: number;
    rentabilidad_estimada?: number;
    beneficio_estimado?: number;
    plazo_ejecucion?: number;
    ejecucion_proyecto?: number;
  },
  prisma: PrismaClient
) => {
  return await prisma.projects.update({
    where: { id: Number(id) },
    data: {
      ...data,
    },
  });
};

export const getTotalBalanceVenta = async (wallet: string) => {
  let balanceContract = 0;
  const balanceXRENWallet = await XRENContract.functions.balanceOf(wallet);
  const ids = await saleContract.functions.getIDs(wallet);

  for (let i = 0; i < ids[0].length; i++) {
    balanceContract += Number(
      ethers.utils.formatEther(
        await saleContract.showMyRemainAmount(Number(ids[0][i]))
      )
    );
  }
  return (
    balanceContract +
    Number(ethers.utils.formatEther(balanceXRENWallet.toString()))
  );
};
export const getTotalBalanceStake = async (wallet: string) => {
  let balanceStake = 0,
    isInStake;
  const idStake = await StakeContract.functions.currentIdStake();
  let i = 1;
  while (i <= idStake) {
    isInStake = await StakeContract.functions.isUserInStake(wallet, i);
    if (isInStake[0] == true) {
      balanceStake += Number(
        ethers.utils.formatEther(
          (
            await StakeContract.functions.infoStakeByUser(i, wallet)
          )[0].balance.toString()
        )
      );
    }
    i++;
  }
  return balanceStake;
};
export const getFechaDeVentaInicial = async (
  wallet: string,
  project_id: number,
  prisma: PrismaClient
) => {
  const XRENBALANCE = await getTotalBalanceVenta(wallet);
  const XRENSTAKE = await getTotalBalanceStake(wallet);
  if (XRENBALANCE == 0 && XRENSTAKE == 0) return null;
  const normalUser = await prisma.userManage.findFirst({
    where: { project_id, tipoDeUser: "REGULAR" },
  });
  const premiumUser = await prisma.userManage.findFirst({
    where: { project_id, tipoDeUser: "PREMIUM" },
  });
  const goldPremiumUser = await prisma.userManage.findFirst({
    where: { project_id, tipoDeUser: "PREMIUMGOLD" },
  });
  if (
    goldPremiumUser &&
    XRENBALANCE >= goldPremiumUser.minXRENwallet &&
    XRENSTAKE >=
      (goldPremiumUser.minXRENstake ? goldPremiumUser.minXRENstake : 0)
  )
    return goldPremiumUser.openingDate;
  else if (
    premiumUser &&
    XRENBALANCE >= premiumUser.minXRENwallet &&
    XRENSTAKE >= (premiumUser.minXRENstake ? premiumUser.minXRENstake : 0)
  )
    return premiumUser.openingDate;
  else if (
    normalUser &&
    XRENBALANCE >= normalUser.minXRENwallet &&
    XRENSTAKE >= (normalUser.minXRENstake ? normalUser.minXRENstake : 0)
  )
    return normalUser.openingDate;
};
export const getTipoDeUsuario = async (
  wallet: string,
  project_id: number,
  prisma: PrismaClient
) => {
  const XRENBALANCE = await getTotalBalanceVenta(wallet);
  const XRENSTAKE = await getTotalBalanceStake(wallet);
  const normalUser = await prisma.userManage.findFirst({
    where: { project_id, tipoDeUser: "REGULAR" },
  });
  const premiumUser = await prisma.userManage.findFirst({
    where: { project_id, tipoDeUser: "PREMIUM" },
  });
  const goldPremiumUser = await prisma.userManage.findFirst({
    where: { project_id, tipoDeUser: "PREMIUMGOLD" },
  });
  if (
    goldPremiumUser &&
    XRENBALANCE >= goldPremiumUser.minXRENwallet &&
    XRENSTAKE >=
      (goldPremiumUser.minXRENstake ? goldPremiumUser.minXRENstake : 0)
  )
    return `goldPremiumUser`;
  else if (
    premiumUser &&
    XRENBALANCE >= premiumUser.minXRENwallet &&
    XRENSTAKE >= (premiumUser.minXRENstake ? premiumUser.minXRENstake : 0)
  )
    return `premiumUser`;
  else if (
    normalUser &&
    XRENBALANCE >= normalUser.minXRENwallet &&
    XRENSTAKE >= (normalUser.minXRENstake ? normalUser.minXRENstake : 0)
  )
    return `normalUser`;
};
