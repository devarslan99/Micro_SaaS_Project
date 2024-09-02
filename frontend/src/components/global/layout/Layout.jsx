
import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";

const Layout = ({ menuCollapse, setMenuCollapse,children }) => {
  const [pageTitle, setPageTitle] = useState("Select Software");

  const handlePageSelect = (title) => {
    setPageTitle(title);
  };
  
  return (
    <>
      <Sidebar menuCollapse={menuCollapse} setMenuCollapse={setMenuCollapse} onPageSelect={handlePageSelect} />
      <div className="">
        <Topbar menuCollapse={menuCollapse}  pageTitle={pageTitle} />
        {children}
      </div>
    </>
  );
};

export default Layout;