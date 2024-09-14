import React, { createContext, useState } from "react";

// Create the context
export const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [state, setState] = useState("Some shared data");
  const [selectedOption, setSelectedOption] = useState("");
  const [isAccountImported, setIsAccountImported] = useState(false);

  return (
    <MyContext.Provider
      value={{
        state,
        setState,
        selectedOption,
        setSelectedOption,
        isAccountImported,
        setIsAccountImported,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
