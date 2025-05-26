import { Redirect } from 'expo-router';
import { Slot } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { AxiosInterceptor } from "@/src/core/interceptor";

export default function ProtectedLayout() {
  const { isAuthenticated } = useContext(AuthContext);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setAuthChecked(true);
  }, [isAuthenticated]);

  if (!authChecked) {
    return null;
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
