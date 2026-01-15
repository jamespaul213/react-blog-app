import React,{ useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Api/supaBaseClient";


const Header: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const [user, setUser] = useState<any>(null);

    const user = useSelector((state: any) => state.auth.user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
     dispatch({ type: "auth/clearUser" });
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/"  onClick={() => navigate("/")}>Home</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarSupportedContent">
          {!user && (
            <>
              <button className="btn btn-primary me-2" onClick={() => navigate("/login")}>Login</button>
              <button className="btn btn-primary" onClick={() => navigate("/register")}>Register</button>
            </>
          )}

          {user && (
            <>
              <span className="me-2">Hello, {user.email}</span>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
