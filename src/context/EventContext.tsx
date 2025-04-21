import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EventService {
  id: number;
}

interface Place {
  id: number;
  title: string;
  city?: string;
  street?: string;
  description?: string;
}

interface Event {
  title: string;
  startedAt: string;
  endedAt: string;
  description: string;
  hallId: number;
  place?: Place;
  eventServices: EventService[];
}

interface EventContextType {
  event: Event;
  setEvent: (event: Event) => void;
}

const defaultEvent: Event = {
  title: '',
  startedAt: new Date().toISOString(),
  endedAt: new Date().toISOString(),
  description: '',
  hallId: 0,
  eventServices: [],
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [event, setEvent] = useState<Event>(defaultEvent);

  return (
    <EventContext.Provider value={{ event, setEvent }}>
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
