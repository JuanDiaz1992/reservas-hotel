import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/layout";
import Home from "./pages/home";
import Loguin from "./pages/loguin"

export default function App(){
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="/loguin" element={<Loguin />} />
      </Route>
    </Routes>
  );
}