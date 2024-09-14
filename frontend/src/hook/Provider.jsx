import React, { createContext, useState } from 'react';

// Create the context
export const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [state, setState] = useState("Some shared data");
  const [softwareName, setSoftwareName] = useState("")

  return (
    <MyContext.Provider value={{ state, setState ,softwareName, setSoftwareName }}>
      {children}
    </MyContext.Provider>
  );
};
