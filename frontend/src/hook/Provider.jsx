import React, { useState } from "react";
import MyContext from "./context";

const MyProvider = ({ children }) => {
  const [clientData, setClientData] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(undefined);
  const [loggedInClientId, setLoggedInClientId] = useState(undefined);
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(null);
  const [subscriptionName, setSubscriptionName] = useState("free");
  const [selectedClient, setSelectedClient] = useState("");

  return (
    <MyContext.Provider
      value={{
        clientData,
        setClientData,
        selectedClientId,
        setSelectedClientId,
        loggedInClientId,
        setLoggedInClientId,
        isClientLoggedIn,
        setIsClientLoggedIn,
        selectedClient,
        setSelectedClient,
        subscriptionName, setSubscriptionName,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
