import React,{useState, useEffect,  useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../Api/supaBaseClient";
import { Blog } from "../Types/blog";
import { Container} from "react-bootstrap";

const UpdateBlog: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [blogImage, setBlogImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [originalBlog, setOriginalBlog] = useState<Blog | null>(null); // backup
    const fileInputRef = useRef<HTMLInputElement | null>(null);

        

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

   const handleUpdateImage = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!blog?.id) return;
  if(blog.title.trim() === "" || blog.content.trim() === ""){
    alert("Title and Content cannot be empty");
    return;
  }

  let finalImageUrl = blog.image_url;

  // If user chose to delete image
  if (removeImage && blog.image_url) {
    const oldPath = blog.image_url.split("/post-images/")[1];
    await supabase.storage.from("post-images").remove([oldPath]);
    finalImageUrl = null;
  }

  // If new image selected
  if (blogImage) {
    // Delete old image if exists
    if (blog.image_url) {
      const oldPath = blog.image_url.split("/post-images/")[1];
      await supabase.storage.from("post-images").remove([oldPath]);
    }

    const fileName = `post-${blog.id}-${Date.now()}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(fileName, blogImage);

    if (uploadError) {
      alert("Image upload failed");
      return;
    }

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

    finalImageUrl = data.publicUrl;
  }

  const { error } = await supabase
    .from("blogs")
    .update({
      title: blog.title,
      content: blog.content,
      image_url: finalImageUrl,
    })
    .eq("id", blog.id);

  if (!error) {
    alert("Blog updated!");
    navigate(`/home`);
  }
};

   const handleDeleteImage = async () => {
          setRemoveImage(true);     
          setPreviewImage(null);    
          setBlogImage(null);       

          if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        }
  
   const handleCancel = () =>{
    setBlog(originalBlog);
    setRemoveImage(false);
    setPreviewImage(null);
    navigate(`/view/${blog?.id}`)
   } 


    return(
    <Container className="mt-5 card-header d-flex justify-content-center">
      

    <div className="card" style={{ width: "18rem" }}>
      {!removeImage &&(previewImage || blog?.image_url) && (
        <img
          src={previewImage || blog?.image_url || ""}
          className="card-img-center"
          style={{
            height: "200px",
            objectFit: "fill",
          }}
          alt="Preview"
        />
      )}
          {!removeImage && (previewImage || blog?.image_url)  &&(
                    <button
                    className="delete-image-btn"
                    onClick={() => {handleDeleteImage()}}
                    >
                    ✕
                    </button>
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
              onClick={handleUpdateImage}
            >
              Save
            </button>
            <button
              className="btn btn-secondary me-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
             <input
                          type="file"
                          style={{ display: "none" }}
                          id={`updateImage-${blog?.id}`}
                          accept="image/*"
                         onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setBlogImage(file);

                            if (file) {
                              const previewUrl = URL.createObjectURL(file);
                              setPreviewImage(previewUrl);
                              setRemoveImage(false);
                            }
                          }}
                                                  />
                        <label
                          htmlFor={`updateImage-${blog?.id}`}
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        >
                          <i className="bi bi-paperclip" style={{ fontSize: "1.5rem" }}></i>
                        </label>
                          {/* <span style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
                            {editImageFile.name}
                          </span> */}

          </div>
        </div>
      </div>

    </Container>
    )

}
export default UpdateBlog;