import { useCallback, useMemo, useState } from 'react';

export const useModal = (initialValue = false) => {
  const [modalOpen, setModalOpen] = useState(initialValue);

  const toggle = useCallback(() => setModalOpen((prevState) => !prevState), []);
  const open = useCallback(() => setModalOpen(true), []);
  const close = useCallback(() => setModalOpen(false), []);

  return useMemo(
    () => ({ modalOpen, toggle, open, close }),
    [modalOpen, toggle, open, close],
  );
};
