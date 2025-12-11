import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/layout";
import Home from "./pages/home";
import Loguin from "./pages/loguin";
import Checkout from "./pages/checkout";

export default function App(){
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="/loguin" element={<Loguin />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
    </Routes>
  );
}