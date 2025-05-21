import React, { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { WithoutToken } from '@/src/shared/withoutToken';
import PlaceChoosePage from '@/src/pages/placeChoose';

export default function PlaceChoose() {
  const { isAuthenticated } = useContext(AuthContext);

  return <>{isAuthenticated ? <PlaceChoosePage /> : <WithoutToken />}</>;
}
