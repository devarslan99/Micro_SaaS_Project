import { useState } from "react";
import Home from "./pages/Home/Home"
import SignInSignUp from "./pages/SigninSignup/SignInSignUp"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/global/layout/Layout";
import CompaignAnalytics from "./pages/CompaignsAnalytics/CompaignAnalytics";
import EmailStats from "./pages/EmailStats/EmailStats";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ResetPasswordSuccess from "./pages/PasswordSuccess/PasswordSuccess";
import AuthSetter from './components/AuthSetter/AuthSetter ';
import Settings from "./pages/Settings/Settings";
import Pricing from "./pages/Pricing/Pricing";
import Success from "./pages/PaymentSuccess/Success";

function App() {
  const [menuCollapse, setMenuCollapse] = useState(false);  

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<SignInSignUp />} />
        <Route exact path="/forget-password" element={<ForgetPassword />} />
        <Route exact path="/reset-password" element={<ResetPassword  />} />
        <Route exact path="/reset-password-success" element={<ResetPasswordSuccess  />} />
        <Route path="/authsetter" element={<AuthSetter />} />
        <Route
          path="/home"
          element={
            <Layout
              menuCollapse={menuCollapse} 
              setMenuCollapse={setMenuCollapse}
            >
              <Home menuCollapse={menuCollapse} />
            </Layout>
          }
        />
        <Route
          path="/compaigns"
          element={
            <Layout
              menuCollapse={menuCollapse} 
              setMenuCollapse={setMenuCollapse}
            >
              <CompaignAnalytics menuCollapse={menuCollapse} />
            </Layout>
          }
        />
        <Route
          path="/email_stats"
          element={
            <Layout
              menuCollapse={menuCollapse} 
              setMenuCollapse={setMenuCollapse}
            >
              <EmailStats menuCollapse={menuCollapse} />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout
              menuCollapse={menuCollapse} 
              setMenuCollapse={setMenuCollapse}
            >
              <Settings menuCollapse={menuCollapse} />
            </Layout>
          }
        />
        <Route
          path="/pricing"
          element={
            <Layout
              menuCollapse={menuCollapse} 
              setMenuCollapse={setMenuCollapse}
            >
              <Pricing menuCollapse={menuCollapse} />
            </Layout>
          }
        />
        <Route
          path="/success"
          element={
            <Layout
              menuCollapse={menuCollapse} 
              setMenuCollapse={setMenuCollapse}
            >
              <Success menuCollapse={menuCollapse} />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
      {/* <SignInSignUp/> */}
    </>
  )
}

export default App
