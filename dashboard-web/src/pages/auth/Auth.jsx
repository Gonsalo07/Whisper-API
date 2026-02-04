import { useState } from "react";
import "./auth.scss";
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register.jsx";

const Auth = () => {
  const [type, setType] = useState(0);

  const renderAuth = () => {
    switch (type) {
      case 0:
        return <Login />;
      case 1:
        return <Register />;
      default:
        return <Login />;
    }
  };

  return <div className="wrap_auth">{renderAuth()}</div>;
};

export default Auth;
