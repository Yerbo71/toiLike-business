import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { WithoutToken } from '@/src/shared/withoutToken';
import HallChoosePage from '@/src/pages/hallChoose';

export default function HallChoose() {
  const { isAuthenticated } = useContext(AuthContext);

  return <>{isAuthenticated ? <HallChoosePage /> : <WithoutToken />}</>;
}
