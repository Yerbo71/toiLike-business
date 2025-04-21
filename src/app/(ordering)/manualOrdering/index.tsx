import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { WithoutToken } from '@/src/shared/withoutToken';
import ManualOrderingPage from '@/src/pages/manualOrdering';

export default function ManualOrdering() {
  const { isAuthenticated } = useContext(AuthContext);

  return <>{isAuthenticated ? <ManualOrderingPage /> : <WithoutToken />}</>;
}
