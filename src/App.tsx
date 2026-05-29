import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router"
import { InitialPage } from "./routes/pages/intialPage";
import { MainPage } from "./routes/pages/mainPage";

export function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/project" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  )
}

