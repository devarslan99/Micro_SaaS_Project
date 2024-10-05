
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import axios from "axios";
import { BASE_URL } from "../../../config";
import MyContext from "../../../hook/context";

const Layout = ({ menuCollapse, setMenuCollapse,children }) => {
  const [pageTitle, setPageTitle] = useState("");
  const {  setSubscriptionName,} = useContext(MyContext)

  const handlePageSelect = (title) => {
    setPageTitle(title);
  };

  
  const token = localStorage.getItem("authToken");
  const softwareToken = localStorage.getItem("softwareToken");


  const fetchSubsName = async () => {
    const response = await axios.post(`${BASE_URL}/payment/subscription`,{},{
      headers:{
        Authorization:token,
        softwareAuthorization: softwareToken
      }
    })
    const plan = response.data.plan
    setSubscriptionName(plan)
    console.log(plan)
  }
  
  useEffect(() => {
    fetchSubsName()
  }, [])
  
  return (
    <>
      <Sidebar menuCollapse={menuCollapse} setMenuCollapse={setMenuCollapse} onPageSelect={handlePageSelect} />
      <div className="">
        <Topbar menuCollapse={menuCollapse}  pageTitle={pageTitle} onPageSelect={handlePageSelect} />
        {children}
      </div>
    </>
  );
};

export default Layout;