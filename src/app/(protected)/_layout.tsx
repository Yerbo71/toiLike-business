import { Redirect } from 'expo-router';
import { Slot } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { AxiosInterceptor } from "@/src/core/interceptor";
import { LoadingView } from '@/src/shared';

export default function ProtectedLayout() {
  const { isAuthenticated,isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingView/>;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <AxiosInterceptor>
      <Slot />
    </AxiosInterceptor>
  );
}
