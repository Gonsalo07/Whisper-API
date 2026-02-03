import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Auth />} /> */}
        <Route path="/auth" element={<Auth />} />
        {/* <Route path="/auth/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
