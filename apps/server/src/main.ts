import Fastify from 'fastify';
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import { createTRPCContext as createContext } from '@slated/api';
import { appRouter, type AppRouter } from '@slated/api';
import { clerkPlugin } from '@clerk/fastify';
import ws from '@fastify/websocket';

const host = process.env.SERVER_HOST ?? 'localhost';
const port = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 7100;

// Instantiate Fastify with some config
const server = Fastify({
  logger: process.env.NODE_ENV !== 'production',
  maxParamLength: 5000,
});

server.register(clerkPlugin);

server.register(ws);

server.register(fastifyTRPCPlugin, {
  useWSS: true,
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
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
