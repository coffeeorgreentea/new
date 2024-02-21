import '../../../../packages/ui/utils/src/globals.css';
import { type AppProps } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';
import { api } from 'api-client';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
