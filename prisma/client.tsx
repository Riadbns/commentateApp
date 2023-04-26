import { PrismaClient } from '@prisma/client'

declare global {
    namespace NodeJs{
        interface Global{}
    }
}

interface CustomNodeJsGLobal extends NodeJs.Global{
    prisma: PrismaClient
}

declare const global: CustomNodeJsGLobal
const prisma = global.prisma || new PrismaClient()

if(process.env.NODE_ENV === "development") global.prisma=prisma
export default prisma