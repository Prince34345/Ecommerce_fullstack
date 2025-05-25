import {PrismaClient} from '@prisma/client';


declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

const prismadb = globalThis.prisma || new PrismaClient({
    log: ["error", "info", "query", "warn"]
});

export default prismadb;
