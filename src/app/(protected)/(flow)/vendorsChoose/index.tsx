import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { WithoutToken } from '@/src/shared/withoutToken';
import VendorsChoosePage from '@/src/pages/vendorsChoose';

export default function VendorsChoose() {
  const { isAuthenticated } = useContext(AuthContext);

  return <>{isAuthenticated ? <VendorsChoosePage /> : <WithoutToken />}</>;
}
