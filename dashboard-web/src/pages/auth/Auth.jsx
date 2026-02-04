import { useState } from "react";
import "./auth.scss";
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register.jsx";

const Auth = () => {
  const [type, setType] = useState(0);

  const handleView = (view) => {
    setType(view);
  };

  const renderAuth = () => {
    switch (type) {
      case 0:
        return <Login setView={handleView} />;
      case 1:
        return <Register setView={handleView} />;
      default:
        return <Login setView={handleView} />;
    }
  };

  return <div className="wrap_auth">{renderAuth()}</div>;
};

export default Auth;
