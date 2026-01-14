import React, { useState } from "react";
import { supabase } from "../Api/supaBaseClient";
import { useNavigate } from "react-router-dom";
import { Blog } from "../Types/blog";

const CreateBlog: React.FC = () => {
    const navigate = useNavigate();

    // const [blogs, setBlogs] = useState<Blog>({
    //     id: 0,
    //     title: "",
    //     content: "",
    //     author_id: "",
    //     created_at: "",
    // });
    const [blog, setBlog] = useState<Blog | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
    })



    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);


    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
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
        title: formData.title,
        content: formData.content,
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
        setFormData({ title: "", content: "" });
    }

    setLoading(false);
    };

    
    return(
<form onSubmit={handleSubmit}>
  <input
    type="text"
    name="title"
    placeholder="Title"
    value={formData.title}
    onChange={handleChange}
    required
  />

  <textarea
    name="content"
    placeholder="Content"
    value={formData.content}
    onChange={handleChange}
    required
  />

  <button type="submit" disabled={loading}>
    {loading ? "Saving..." : "Create Blog"}
  </button>
  <button onClick={() => navigate(`/update`)}>
  Edit
</button>
</form>
    )

}
export default CreateBlog;