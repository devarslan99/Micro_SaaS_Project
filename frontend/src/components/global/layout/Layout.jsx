import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import axios from "axios";
import { BASE_URL } from "../../../config";
import MyContext from "../../../hook/context";
import { useNavigate } from "react-router-dom";

const Layout = ({ menuCollapse, setMenuCollapse, children }) => {
  const [pageTitle, setPageTitle] = useState("");
  const {
    setSubscriptionName,
    clientData,
    setClientData,
    setSelectedClientId,
    setSelectedClient,
    setName,
    setEmail
  } = useContext(MyContext);
  const navigate = useNavigate();

  const handlePageSelect = (title) => {
    setPageTitle(title);
  };

  const token = localStorage.getItem("authToken");
  const softwareToken = localStorage.getItem("softwareToken");

  const fetchUserName = async () => {
    console.log('Token being sent:', token);
    const response = await axios.get(`${BASE_URL}/api/auth/user-info`, {
      headers: {
        Authorization: token,
      },
    });

    console.log(response.data.user);
    const userName = response.data.user.name;
    console.log(userName);

    // Capitalize the name
    const capitalized = userName
      .split(' ') // Split the name into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' '); // Join the words back into a single string

    setName(capitalized)
    setEmail(response.data.user.email);
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  const fetchSubsName = async () => {
    const response = await axios.post(
      `${BASE_URL}/payment/subscription`,
      {},
      {
        headers: {
          Authorization: token,
          softwareAuthorization: softwareToken,
        },
      }
    );
    const plan = response.data.plan;
    setSubscriptionName(plan);
    console.log(plan);
  };

  useEffect(() => {
    fetchSubsName();  
  }, []);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const softwareToken = localStorage.getItem("softwareToken");
        const authToken = localStorage.getItem("authToken");
        if(!authToken){
          navigate('/')
        }
        if (!softwareToken) {
          navigate("/home"); // Redirect if no softwareToken found
          return;
        }

        const response = await axios.get(`${BASE_URL}/selectedClients`, {
          headers: {
            softwareToken: `${softwareToken}`,
            authToken: `${authToken}`,
          },
        });

        console.log("client data", response.data);

        if (response.status === 200 && response.data.length > 0) {
          setClientData(response.data); // Set the fetched clients to state
          setSelectedClient(response.data[0]?.selectedName); // Set default selected client
          setSelectedClientId(response.data[0]?.clientId);
        } else {
          console.log("Failed to fetch clients");
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, [navigate]);

  return (
    <>
      <Sidebar
        menuCollapse={menuCollapse}
        setMenuCollapse={setMenuCollapse}
        onPageSelect={handlePageSelect}
      />
      <div className="">
        <Topbar
          menuCollapse={menuCollapse}
          pageTitle={pageTitle}
          onPageSelect={handlePageSelect}
        />
        {children}
      </div>
    </>
  );
};

export default Layout;
