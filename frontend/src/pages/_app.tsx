import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { Layout } from '../components/layout/Layout';
import '../styles/globals.css';

const PUBLIC_ROUTES = ['/login', '/register', '/'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);

  return (
    <AuthProvider>
      <ToastProvider>
        <Toaster
          position="top-right"
          gutter={8}
          containerStyle={{ top: 16, right: 16 }}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#3F4F44',
              color: '#DCD7C9',
              border: '1px solid rgba(162, 123, 92, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#A27B5C',
                secondary: '#DCD7C9',
              },
            },
            error: {
              style: {
                background: '#2C3930',
                border: '1px solid rgba(248, 113, 113, 0.4)',
              },
              iconTheme: {
                primary: '#f87171',
                secondary: '#DCD7C9',
              },
            },
          }}
        />
        {isPublicRoute ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ToastProvider>
    </AuthProvider>
  );
}