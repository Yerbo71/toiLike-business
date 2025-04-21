import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { WithoutToken } from '@/src/shared/withoutToken';
import StaffOrderingPage from '@/src/pages/staffOrdering';

export default function StaffOrdering() {
  const { isAuthenticated } = useContext(AuthContext);

  return <>{isAuthenticated ? <StaffOrderingPage /> : <WithoutToken />}</>;
}
