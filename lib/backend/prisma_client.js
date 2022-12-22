import { PrismaClient } from '@prisma/client'

if (!global.prisma) {
    const prisma = new PrismaClient(process.env.NODE_ENV !== 'production' && { log: ['query'] })

    global.prisma = prisma
}

/** @type {PrismaClient} */
const prisma = global.prisma

export default prisma
