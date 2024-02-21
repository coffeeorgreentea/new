import '../../../../packages/ui/utils/src/globals.css';
import { type AppProps } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';
import { api } from 'api-client';
import { Layout } from '../components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
