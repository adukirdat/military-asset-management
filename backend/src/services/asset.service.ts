import { Prisma, type AssetStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';
const select = { id:true,assetTag:true,status:true,createdAt:true,updatedAt:true,base:{select:{id:true,name:true,location:true}},equipmentType:{select:{id:true,name:true,category:true}} } satisfies Prisma.AssetSelect;
export type SafeAsset=Prisma.AssetGetPayload<{select:typeof select}>;
export class AssetError extends Error { constructor(public code:'NOT_FOUND'|'DUPLICATE'|'DELETE_BLOCKED',message:string){super(message)} }
function map(error:unknown):never { if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==='P2002')throw new AssetError('DUPLICATE','An asset with this tag already exists.');throw error; }
async function relations(equipmentTypeId:string,baseId:string){const [type,base]=await Promise.all([prisma.equipmentType.findUnique({where:{id:equipmentTypeId}}),prisma.base.findUnique({where:{id:baseId}})]);if(!type)throw new AssetError('NOT_FOUND','Equipment type not found.');if(!base)throw new AssetError('NOT_FOUND','Base not found.');}
export async function createAsset(data:{assetTag:string;equipmentTypeId:string;baseId:string;status:AssetStatus}):Promise<SafeAsset>{await relations(data.equipmentTypeId,data.baseId);try{return await prisma.asset.create({data,select})}catch(e){map(e)}}
export async function listAssets(where:Prisma.AssetWhereInput):Promise<SafeAsset[]>{return prisma.asset.findMany({where,select,orderBy:{assetTag:'asc'}})}
export async function getAsset(id:string):Promise<SafeAsset>{const asset=await prisma.asset.findUnique({where:{id},select});if(!asset)throw new AssetError('NOT_FOUND','Asset not found.');return asset}
export async function updateAsset(id:string,data:{assetTag:string;equipmentTypeId:string;baseId:string;status:AssetStatus}):Promise<SafeAsset>{await getAsset(id);await relations(data.equipmentTypeId,data.baseId);try{return await prisma.asset.update({where:{id},data,select})}catch(e){map(e)}}
export async function deleteAsset(id:string):Promise<void>{await getAsset(id);if(await prisma.assignment.count({where:{assetId:id}}))throw new AssetError('DELETE_BLOCKED','Asset cannot be deleted because it has related records.');await prisma.asset.delete({where:{id}})}
