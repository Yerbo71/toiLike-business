import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { WithoutToken } from '@/src/shared/withoutToken';
import ProfilePage from '@/src/pages/profile';

export default function Profile() {
  const { isAuthenticated } = useContext(AuthContext);

  return <>{isAuthenticated ? <ProfilePage /> : <WithoutToken />}</>;
}
