import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { WithoutToken } from '@/src/shared/withoutToken';
import CountryChoosePage from '@/src/pages/countryChoose';

export default function CountryChoose() {
  const { isAuthenticated } = useContext(AuthContext);

  return <>{isAuthenticated ? <CountryChoosePage /> : <WithoutToken />}</>;
}
