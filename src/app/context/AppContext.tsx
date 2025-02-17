"use client";
import { createContext, useState, ReactNode } from "react";

type AppContextType = {
  editedUserId: string;
  setEditedUserId: (id: string) => void;
};

type AppContextProviderProps = {
  children: ReactNode;
};

// Create context
export const AppContext = createContext({} as AppContextType);

export const AppContextProvider = (props: AppContextProviderProps) => {
  const [editedUserId, setEditedUserId] = useState("");

  const value: AppContextType = {
    editedUserId,
    setEditedUserId,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
