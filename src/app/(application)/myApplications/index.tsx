import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { WithoutToken } from '@/src/shared/withoutToken';
import MyApplicationsPage from '@/src/pages/myApplications';

export default function MyApplications() {
  const { isAuthenticated } = useContext(AuthContext);
  return <>{isAuthenticated ? <MyApplicationsPage /> : <WithoutToken />}</>;
}
