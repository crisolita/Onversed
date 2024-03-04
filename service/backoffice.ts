import {  Escenario, Estado, PrismaClient } from "@prisma/client";


export const updateEscenario = async (
  id: number,
  data: {  
    aporte_inversores?:number, 
    beneficio?:number, 
    rentabilidad?:number,  
    coste_activo?:number,  
    costo_construccion?:number,
    gestion_xperiend?:number,
    coste_desarrollo?:number,
    coste_promocion?:number,
    recursion?:number
   },
  prisma: PrismaClient
) => {
  return await prisma.escenario_economico.update({
    where: { id:id},
    data: {
      ...data,
    },
  });
};
export const getProjectById = async (id: number, prisma: PrismaClient) => {
  return await prisma.projects.findUnique({
    where: { id: id },
  });
};
export const updateFechas = async (
  id: number,
  data: {  
    fecha_inicio_reinversion?:Date,
    fecha_fin_venta?:Date,
    fecha_fin_reinversion?:Date,
    fecha_fin_reclamo?:Date,
    fecha_inicio_reclamo?:Date,
    fecha_inicio_intercambio?:Date,
    fecha_fin_intercambio?:Date,
    visible_user?:boolean,
    visible_premium?:boolean,
    visible_gold?:boolean,
    visible_intercambio?:boolean,
    visible_reclamo?:boolean,
    visible_reinversion?:boolean
   },
  prisma: PrismaClient
) => {
  return await prisma.gestion_fechas.update({
    where: { project_id: Number(id)},
    data: {
      ...data,
    },
  });
};
export const updateProject = async (
  id: number,
  data:{
    cuenta_id?: number,
    titulo?:string,
    ubicacion?:string,
    definicion?:string, 
    resumen?:string,
    cantidadInicial?:number,
    cantidadRestante?:number,
    precio_unitario?:number,
    beneficioPorNFT?:number,
    proyectoReinversion?:number,
    rentabilidad_estimada?:number,
    beneficio_estimado?:number,
    plazo_ejecucion?:number,
    ejecucion_proyecto?:number,
    concepto_bancario?:string,
    description?:string,
    recuperar_dinero_info?:string,
    pagoTarjeta?:boolean,pagoTransferencia?:boolean,pagoCripto?:boolean
  },
  prisma: PrismaClient
) => {
  return await prisma.projects.update({
    where: { id: Number(id)},
    data: {
      ...data
    },
  });
};
export const createGestionXREN = async (
  data:{
 numero?:string, banco?:string,pagoTransferencia?:boolean,titular?:string,
 pagoTarjeta?:boolean,
 pagoCripto?:boolean,
 concepto_bancario?:string
  },
  prisma: PrismaClient
) => {
  return await prisma.gestionXREN.create({
    data: {
      ...data
    },
  });
};
export const updateGestionXREN = async (
  id:number,
  data:{
 numero?:string, banco?:string,pagoTransferencia?:boolean,
 pagoTarjeta?:boolean,titular?:string,
 pagoCripto?:boolean,
 concepto_bancario?:string
  },
  prisma: PrismaClient
) => {
  return await prisma.gestionXREN.update({
    where:{id},
    data: {
      ...data
    },
  });
};
export const getGestion = async (
  prisma: PrismaClient
) => {
  return await prisma.gestionXREN.findFirst();
};

