
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layouts/MainLayout";
import type { RouteConfig } from "../interfaces/routes";
import Home from "../pages/Home";
import Login from "../components/features/auth/login/Login";

import Verify2FA from "../components/features/auth/login/Verify2FA";
import Register from "../components/features/auth/register/Register";
import NotFound from "../components/features/auth/notFound/NotFound";
import VerifyAccount from "../components/features/auth/login/VerifyAccount";
import Profile from "../components/features/auth/profile/Profile";
import ForgotPassword from "../components/features/auth/login/ForgotPassword";
import ResetPassword from "../components/features/auth/login/ResetPassword";
import RegisterSocial from "../components/features/auth/register/RegisterSocial";
import ProductDetail from "../components/features/poducts/productDetails";




const routes: RouteConfig[] = [
  { path: '/', component: Home },
  // { path: '/loginSuccess', component: LoginSuccess },
  // { path: '/login', component: Login },
  // { path: '/verify2fa', component: Verify2FA },
  // { path: '/register', component: Register},
//   { path: '/verify2fa', component: Verify2FA, protected: true },
];

const AppRoutes = () => {
  return (
    <Router>
      {/* <Layout /> */}
        <Routes>
          <Route path="/" element={<Layout/>} >
            {routes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="/product/:productId" element={<ProductDetail productId="" />} />
          </Route>
          
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/verifyAccount" element={<VerifyAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify2fa" element={<Verify2FA />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registersocial" element={<RegisterSocial email="" />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />

        </Routes>
      
    </Router>
  )
}

export default AppRoutes