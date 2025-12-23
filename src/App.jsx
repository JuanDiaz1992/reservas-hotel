import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/layout";
import Home from "./pages/home";
import Loguin from "./pages/loguin";
import Checkout from "./pages/checkout";
import CheckReservationPage from "./pages/checkReservation";
import TermsAndConditions from "./pages/termsAndConditions";

export default function App(){
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="/loguin" element={<Loguin />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/details" element={<Checkout />} />
        <Route path="/checkout/success" element={<Checkout />} />
        <Route path="/checkout/success/:param" element={<Checkout />} />
        <Route path="/my-reservation/:param?" element={<CheckReservationPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      </Route>
    </Routes>
  );
}