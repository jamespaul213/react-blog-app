import React, { useState } from "react";
import { supabase } from "../Api/supaBaseClient";
import { useNavigate } from "react-router-dom";
import { Blog } from "../Types/blog";
import { Container, Button, Form, Col, Card } from "react-bootstrap";

const CreateBlog: React.FC = () => {
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog>({
      title: "",
      content: "",
      author_id: "",
    });

    const [formData, setFormData] = useState({
        title: "",
        content: "",
    })
    const [loading, setLoading] = useState(false);


    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
    const { name, value } = e.target;

    setBlog((prev) => ({
        ...prev,
        [name]: value,
    }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        alert("You must be logged in");
        setLoading(false);
        return;
    }

    console.log("userID",user.id);

    const newBlog: Blog = {
        title: blog.title,
        content: blog.content,
        author_id: user.id,
    };

    const { error } = await supabase
        .from("blogs")
        .insert(newBlog);

    if (error) {
        console.error(error.message);
        alert(error.message);
    } else {
        alert("Blog created successfully!");
        setBlog({ title: "", content: "" });
        navigate("/");
    }

    setLoading(false);
    };

    
  return(
    <Container className="mt-5 card-header d-flex justify-content-center">
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-header">
            <input
            className="form-control mb-2"
             name="title"
            placeholder="Title"
            value={blog.title}
            onChange={handleChange}
          />
        </div>
        <div className="card-body">
        <textarea
            className="form-control"
             name="content"
            placeholder="Content"
            rows={4}
            value={blog.content}
            onChange={handleChange}
          />
        </div>
         <button
              className="btn btn-primary mt-2"
              onClick={handleSubmit}
            >
              Create
            </button>
      </div>
    </Container>
  )

}
export default CreateBlog;