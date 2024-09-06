import { PrismaClient } from "@prisma/client";


declare global {
   var prismma: PrismaClient | undefined;
}

const prismadb = globalThis.prismma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prismma = prismadb

export default prismadb