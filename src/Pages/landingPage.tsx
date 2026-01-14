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
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import ViewBlog from "./viewBlogPage";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]); 
    // const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
  const fetchUserBlogs = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);
      return;
    }

    if (!user) return;
    console.log('FROM LANDING PAGE User', user);

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("author_id", user.id) 
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching blogs:", error);
    else setBlogs(data || []);
     console.log('FROM LANDING PAGE User2', user);
     console.log('FROM LANDING PAGE Data', data);
  };

  fetchUserBlogs();
}, []);

   return (
  <Container className="mt-5">
  <Row>
    {blogs.map((blog) => (
      <Col key={blog.id} md={6} lg={4} className="mb-4">
        <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
            <h5 className="card-title">Title:{blog.title}</h5>
            <Button
              variant="primary"
              className="ms-2"
              onClick={() => navigate(`/view/${blog.id}`)}
            >View Blog
            </Button>

            <Button
              variant="primary"
              onClick={() => navigate(`/update/${blog.id}`)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              className="ms-2"
             onClick={() => navigate(`/delete/${blog.id}`)}
            >
              Delete
            </Button>
        </div>
        </div>
      </Col>
    ))}
  </Row>
</Container>
  );
};

export default LandingPage;