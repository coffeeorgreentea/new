import Fastify from 'fastify';
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import { createTRPCContext } from 'api';
import { appRouter, type AppRouter } from 'api';
import { clerkClient, clerkPlugin, getAuth } from '@clerk/fastify';
import ws from '@fastify/websocket';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import * as dotenv from 'dotenv';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';

dotenv.config();

const host = process.env.SERVER_HOST ?? 'localhost';
const port = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 7100;

// Instantiate Fastify with some config
const server = Fastify({
  // logger: process.env.NODE_ENV !== 'production',
  logger: false,
  maxParamLength: 5000,
});

server.register(cors, {
  origin: (origin, cb) => {
    if (/^https?:\/\/localhost(?::\d{1,5})?$/.test(origin!) || !origin) {
      //  Allow origins that are localhost with any port or unspecified (no origin)
      cb(null, true);
    } else {
      // For other origins, you might want to throw an error, or adjust the condition to allow them
      cb(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
});

server.register(ws);
server.register(clerkPlugin);

server.register(sensible);

server.register(cookie);

server.register(helmet);

server.get('/hello', async (req, reply) => {
  const auth = getAuth(req);
  console.log('auth', auth);
  return { hello: 'world' };
});

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
