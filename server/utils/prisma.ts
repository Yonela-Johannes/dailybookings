import { PrismaPg } from '@prisma/adapter-pg'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

const connectionString = process.env.DIRECT_URL
if (!connectionString) {
  throw new Error('DIRECT_URL is not defined')
}
const adapter = new PrismaPg({
  connectionString,
})
const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined
}
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
