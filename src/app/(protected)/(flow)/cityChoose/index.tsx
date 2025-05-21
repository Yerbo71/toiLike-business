import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { WithoutToken } from '@/src/shared/withoutToken';
import CityChoosePage from '@/src/pages/cityChoose';

export default function CityChoose() {
  const { isAuthenticated } = useContext(AuthContext);

  return <>{isAuthenticated ? <CityChoosePage /> : <WithoutToken />}</>;
}
