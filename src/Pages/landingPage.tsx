import React from "react";
import CreateBlog from "../Pages/createBlogPage";
import EditBlog from "./editBlogPage";
import DeleteBlog from "./deleteBlogPage";
import LogIn from "./logInPage";
import RegistrationForm from "./registerPage";

const LandingPage: React.FC = () => {
    return(
        <div>
        <h1>Hello This is my Landing Page</h1>
        <CreateBlog />
        <EditBlog />
        <DeleteBlog />
        <LogIn />
        <RegistrationForm />
        </div>
    )
};


export default LandingPage;