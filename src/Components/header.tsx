import React from "react";
import LogIn from "../Pages/logInPage";
import RegistrationForm from "../Pages/registerPage";
import { Navigate, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
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
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
               <button  type="button" className="btn btn-primary" onClick={() => navigate(`/login`)}>Log In</button>
              <button  type="button" className="btn btn-primary" onClick={() => navigate(`/register`)}>Register</button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
