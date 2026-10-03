// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
//---------
// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ["error"],
//   });

// if (process.env.NODE_ENV !== "production")
//   globalForPrisma.prisma = prisma;
//---------

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type HyperdriveEnv = { HYPERDRIVE?: { connectionString: string } };

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const perRequest = new WeakMap<object, PrismaClient>();

function createClient(connectionString: string) {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter, log: ["error"] });
}

function getClient(): PrismaClient {
  try {
    const { env, ctx } = getCloudflareContext();
    const hyperdrive = (env as unknown as HyperdriveEnv).HYPERDRIVE;
    if (hyperdrive) {
      let client = perRequest.get(ctx);
      if (!client) {
        client = createClient(hyperdrive.connectionString);
        perRequest.set(ctx, client);
      }
      return client;
    }
  } catch {
    // Not inside a Worker request (build step, scripts, plain `next dev`)
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient(process.env.DATABASE_URL!);
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});