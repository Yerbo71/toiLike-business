import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import axios from 'axios';


export const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContext(AuthContext);

  React.useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error('Axios error:', error);
        console.log("Axios error response:", error.response);
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