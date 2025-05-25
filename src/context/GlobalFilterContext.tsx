import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CityEnum = 'ALMATY' | 'ASTANA' | 'SHYMKENT';

type GlobalFilterContextType = {
  city: string | null;
  setCity: (city: CityEnum) => void;
};

const GlobalFilterContext = createContext<GlobalFilterContextType | undefined>(
  undefined,
);

export const GlobalFilterProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCity] = useState<CityEnum>('ALMATY');

  return (
    <GlobalFilterContext.Provider value={{ city, setCity }}>
      {children}
    </GlobalFilterContext.Provider>
  );
};

export const useGlobalFilters = () => {
  const context = useContext(GlobalFilterContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalFilters must be used within a GlobalFilterProvider',
    );
  }
  return context;
};
