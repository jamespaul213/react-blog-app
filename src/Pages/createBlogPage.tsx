import React, { useState } from "react";
import { supabase } from "../Api/supaBaseClient";
import { useNavigate } from "react-router-dom";
import { Blog } from "../Types/blog";
import { Container } from "react-bootstrap";

const CreateBlog: React.FC = () => {
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog>({
      title: "",
      content: "",
      author_id: "",
      image_url: null,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
 

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

    let imageUrl: string | null = null;
    

    if(imageFile){
      const fileName = `${Date.now()}-${imageFile.name}`;
      const {error: uploadError} = await supabase.storage
      .from("post-images")
      .upload(fileName, imageFile);

      if(uploadError){
         console.error(uploadError.message);
         alert("Failed to upload image");
         return;
      }

       const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

       imageUrl = data.publicUrl;
  }

  
    
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        alert("You must be logged in");
        return;
    }


    console.log("userID",user.id);

    const newBlog: Blog = {
        title: blog.title,
        content: blog.content,
        author_id: user.id,
        image_url: imageUrl,
    };

    const { error } = await supabase
        .from("blogs")
        .insert(newBlog);

    if (error) {
        console.error(error.message);
        alert(error.message);
    } else {
        alert("Blog created successfully!");
        setBlog({ title: "", content: "" , image_url: null });
        setImageFile(null);
        navigate("/home");
    }
    };

    
  return(
    <Container className="mt-5 card-header d-flex justify-content-center">
       <div className="card" style={{ width: "18rem" }}>
         {imageFile && (
      <img
        src={URL.createObjectURL(imageFile)}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
        alt="Preview"
      />
    )}
      <input
        type="file"
        accept="image/*"
        className="form-control"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setImageFile(file);
        }}
      />
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