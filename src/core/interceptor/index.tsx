import React, { useContext } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/src/context/AuthContext';
import axios from 'axios';

export const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContext(AuthContext);
  const router = useRouter();

  React.useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers.locale = 'en';
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error('Axios error:', error);
        if (error.response?.status === 401) {
          console.log('Unauthorized, redirecting to login...');
          // @ts-ignore
          router.push('/(auth)/login)');
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, router]);

  return <>{children}</>;
};