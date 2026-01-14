import React,{useEffect, useState} from "react";
import CreateBlog from "../Pages/createBlogPage";
import EditBlog from "./updateBlogPage";
import DeleteBlog from "./deleteBlogPage";
import UpdateBlog from "./updateBlogPage";
import LogIn from "./logInPage";
import RegistrationForm from "./registerPage";
import { useNavigate } from "react-router-dom";
import { Blog } from "../Types/blog";
import { supabase } from "../Api/supaBaseClient";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]); 
    // const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
    const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setBlogs(data);
    };

    fetchBlogs();
    }, []);

   return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h3>Title:{blog.title}</h3>
          <p>Content:{blog.content}</p>
          <button onClick={() => navigate(`/update/${blog.id}`)}>Edit</button>
          <button onClick={() => navigate(`/delete/${blog.id}`)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default LandingPage;