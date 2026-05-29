import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router"
import { InitialPage } from "./routes/pages/intialPage";

export function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/project" element={<div> HELLO Project</div>} />
      </Routes>
    </BrowserRouter>
  )
}

