"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Session {
  first_name?: string;
  last_name?: string;
  image?: string;
  category?: string;
}

interface SessionContextProps {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const storedSession = sessionStorage.getItem('session');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea === sessionStorage) {
        const updatedSession = sessionStorage.getItem('session');
        setSession(updatedSession ? JSON.parse(updatedSession) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (session) {
      sessionStorage.setItem('session', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('session');
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
