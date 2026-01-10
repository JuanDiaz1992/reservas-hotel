import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/layout";
import Home from "./pages/home";
import LoginPage from "./pages/loginPage";
import Checkout from "./pages/checkout";
import CheckReservationPage from "./pages/checkReservation";
import TermsAndConditions from "./pages/termsAndConditions";
import AdminPanel from "./pages/adminPanel";
import AboutUs from "./pages/aboutUs";
import Contact from "./pages/contac";
import { ProtectedRoute, PublicRoute } from "./context/authGuards";

export default function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="/sobre-nosotros" element={<AboutUs />} />
        <Route path="/contacto" element={<Contact />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/details" element={<Checkout />} />
        <Route path="/checkout/success" element={<Checkout />} />
        <Route path="/checkout/success/:param" element={<Checkout />} />
        <Route
          path="/my-reservation/:param?"
          element={<CheckReservationPage />}
        />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Route>
    </Routes>
  );
}
