import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

interface EventService {
  id: number;
}

interface Event {
  title: string;
  startedAt: string;
  endedAt: string;
  description: string;
  placeId: number;
  eventServices: EventService[];
}

interface EventContextType {
  event: Event;
  setEvent: (event: Event) => void;
  resetEvent: () => void;
}

const defaultEvent: Event = {
  title: '',
  startedAt: new Date().toISOString(),
  endedAt: new Date().toISOString(),
  description: '',
  placeId: 0,
  eventServices: [],
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [event, setEvent] = useState<Event>(defaultEvent);

  const resetEvent = useCallback(() => {
    setEvent(defaultEvent);
  }, []);

  return (
    <EventContext.Provider value={{ event, setEvent, resetEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
