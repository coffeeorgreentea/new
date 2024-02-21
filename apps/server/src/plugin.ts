import fp from 'fastify-plugin';
import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import {
  Clerk,
  createIsomorphicRequest,
  constants,
  type AuthObject,
  type ClerkOptions,
} from '@clerk/backend';

export enum AllowedHooks {
  OnRequest = 'onRequest',
  PreHandler = 'preHandler',
}

export type ClerkFastifyOptions = Omit<ClerkOptions, 'apiKey'> & {
  hookName?: AllowedHooks;
};

const API_URL = process.env.CLERK_API_URL || 'https://api.clerk.dev';
const API_VERSION = process.env.CLERK_API_VERSION || 'v1';
const SECRET_KEY = process.env.CLERK_SECRET_KEY || '';
const PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY || '';
const JWT_KEY = process.env.CLERK_JWT_KEY || '';

const { Headers } = constants;

const createClerkClient = () =>
  Clerk({
    secretKey: SECRET_KEY,
    apiUrl: API_URL,
    apiVersion: API_VERSION,
    jwtKey: JWT_KEY,
    userAgent: '@coffeeorgreentea/clerk-fastify@0.1.0',
  });

const clerkClient = createClerkClient();

const withClerkMiddleware =
  (opts: ClerkFastifyOptions) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    const secretKey = opts.secretKey || SECRET_KEY;
    const publishableKey = opts.publishableKey || PUBLISHABLE_KEY;

    const requestState = await clerkClient.authenticateRequest({
      ...opts,
      secretKey,
      publishableKey,
      request: createIsomorphicRequest((Request, Headers) => {
        const requestHeaders = Object.keys(req.headers).reduce(
          (acc, key) => ({ ...acc, [key]: req.headers[key] }),
          {}
        );
        const headers = new Headers(requestHeaders);
        const dummyOriginReqUrl = new URL(
          req.url || '',
          `${req.protocol}://clerk-dummy`
        );
        return new Request(dummyOriginReqUrl, {
          method: req.method,
          headers,
        });
      }),
    });

    if (requestState.isUnknown || requestState.isInterstitial) {
      const statusCode = 401;
      const headers = {
        [Headers.AuthReason]: requestState.reason,
        [Headers.AuthMessage]: requestState.message,
      };
      if (requestState.isInterstitial) {
        const interstitialHtmlPage = clerkClient.localInterstitial({
          publishableKey,
          frontendApi: '',
        });
        reply
          .code(statusCode)
          .headers(headers)
          .type('text/html')
          .send(interstitialHtmlPage);
      } else {
        reply.code(statusCode).headers(headers).send();
      }
      return;
    }

    req.auth = requestState.toAuth();
  };

const clerkPlugin: FastifyPluginCallback<ClerkFastifyOptions> = (
  instance,
  opts,
  done
) => {
  instance.decorateRequest('auth', null);
  const hookName = (opts.hookName as AllowedHooks) || AllowedHooks.PreHandler;
  if (!Object.values(AllowedHooks).includes(hookName)) {
    throw new Error(`Unsupported hookName: ${hookName}`);
  }
  instance.addHook(hookName, withClerkMiddleware(opts));
  done();
};

export const clerkFastifyPlugin = fp(clerkPlugin, {
  name: '@clerk/fastify',
  fastify: '4.x',
});

const errorMessage = (msg: string) => `🔒 Clerk: ${msg.trim()}
For more info, check out the docs: https://clerk.com/docs,
or come say hi in our discord server: https://clerk.com/discord
`;

const getAuth = (req: FastifyRequest) => {
  if (!req.auth)
    throw new Error(
      errorMessage(
        `The "clerkPlugin" should be registered before using the "getAuth".`
      )
    );
  return req.auth;
};

export {
  clerkClient,
  clerkFastifyPlugin as clerkPlugin,
  createClerkClient,
  getAuth,
};

declare module 'fastify' {
  // This should reflect the specific custom shape of your "auth" request data
  interface FastifyRequest {
    auth?: AuthObject; // Or whatever type it actually is
  }
}
