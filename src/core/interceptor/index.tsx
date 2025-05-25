import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import axios from 'axios';


export const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContext(AuthContext);

  React.useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const newConfig = { ...config };
        if (token) {
          newConfig.headers.Authorization = `Bearer ${token}`;
        }
        if (newConfig.data instanceof FormData) {
          newConfig.headers['Content-Type'] = 'multipart/form-data';
        }
        return newConfig;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error('Axios error:', error);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  return <>{children}</>;
};