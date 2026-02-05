import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/auth/dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />{" "}
        {/* Esto es temporal por ahora  */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/  " element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
