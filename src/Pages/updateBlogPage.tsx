import React,{useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../Api/supaBaseClient";
import { Blog } from "../Types/blog";

const UpdateBlog: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchBlog = async () => {
        if (!id) return;

        const{ data, error} = await supabase
        .from("blogs")
        .select("*")
        .eq("id",id)
        .single();

        if (error){
        console.error(error);
        } else {
        setBlog(data);
        }

        setLoading(false);
    }
        fetchBlog();
   },[id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setBlog((prev) => (prev ? {...prev, [name]:value } : prev));
   }

   const handleUpdate = async(e: React.FormEvent) => {
    e.preventDefault();
    if(!blog?.id) return;

    const {error} = await supabase
    .from("blogs")
    .update({
        title: blog.title,
        content: blog.content,
    })
    .eq("id",blog.id);

    if(!error){
        navigate(`/`)
    }

    if (loading) return <p>Loading blog...</p>;
    if (!blog) return <p>Blog not found</p>;
   };


    return(
         <form onSubmit={handleUpdate}>
      <input
        type="text"
        name="title"
        value={blog?.title || ""}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        value={blog?.content || ""}
        onChange={handleChange}
        required
      />
      <button type="submit">Update Blog</button>
    </form>
    )

}
export default UpdateBlog;