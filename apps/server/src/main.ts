import Fastify from 'fastify';
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import { createTRPCContext } from 'api';
import { appRouter, type AppRouter } from 'api';
import { clerkPlugin } from '@clerk/fastify';
import ws from '@fastify/websocket';
import cors from '@fastify/cors';

const host = process.env.SERVER_HOST ?? 'localhost';
const port = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 7100;

// Instantiate Fastify with some config
const server = Fastify({
  logger: process.env.NODE_ENV !== 'production',
  maxParamLength: 5000,
});

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

server.register(clerkPlugin);

server.register(ws);

server.register(fastifyTRPCPlugin, {
  useWSS: true,
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext: createTRPCContext,
    onError({ path, error }) {
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

(async () => {
  try {
    await server.listen({ port, host });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
