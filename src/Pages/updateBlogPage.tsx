import React,{useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../Api/supaBaseClient";
import { Blog } from "../Types/blog";
import { Container} from "react-bootstrap";

const UpdateBlog: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [originalBlog, setOriginalBlog] = useState<Blog | null>(null); // backup

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
        setOriginalBlog(data);
        }
    }
        fetchBlog();
   },[id]);

   const handleUpdate = async(e: React.FormEvent) => {
    e.preventDefault();
    if(!blog?.id) return;

    const {error} = await supabase
    .from("blogs")
    .update({
        title: blog.title,
        content: blog.content,
        image_url: blog.image_url
    })
    .eq("id",blog.id);

    if(!error){
        alert("Blog updated!");
        navigate(`/home`)
    }
   };
   const handleCancel = () =>{
    setBlog(originalBlog);
    navigate(`/view/${blog?.id}`)
   } 


    return(
    <Container className="mt-5 card-header d-flex justify-content-center">

    <div className="card" style={{ width: "18rem" }}>
       {blog?.image_url && (
            <img
              src={blog.image_url}
              className="card-img-center"
              style={{
              height: "200px",
              objectFit: "fill",
            }}
            alt="Placeholder"
            />
          )}
      <div className="card-body">
          <input
            className="form-control mb-2"
            value={blog?.title || ""}
            onChange={(e) =>
              setBlog(prev => prev ? { ...prev, title: e.target.value } : prev)
            }
          />
          <textarea
            className="form-control"
            rows={4}
            value={blog?.content || ""}
            onChange={(e) =>
              setBlog(prev => prev ? { ...prev, content: e.target.value } : prev)
            }
          />
          <div className="d-flex justify-content-center mt-2">
            <button
              className="btn btn-primary"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="btn btn-secondary me-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

    </Container>
    )

}
export default UpdateBlog;