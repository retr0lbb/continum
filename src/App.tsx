import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router"

export function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div> HELLO WORD</div>} />
        <Route path="/project" element={<div> HELLO Project</div>} />
      </Routes>
    </BrowserRouter>
  )
}

