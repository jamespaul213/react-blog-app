import React, {useEffect,useState} from "react";
import {  Button, Col, Row, Container } from "react-bootstrap"
import { useNavigate, useParams} from "react-router-dom";
import { supabase } from "../Api/supaBaseClient";
import { Blog } from "../Types/blog";
import { Comment } from "../Types/comment"


const ViewBlog: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [blog, setBlogData] = useState<Blog | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [commentImage, setCommentImage] = useState<File | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchBlog = async () => {
        if (!id) return;

        const {data,error} = await supabase
        .from("blogs")
        .select("*")
        .eq("id",id)
        .single();

        if(error){
            alert(error);
        }else{
            setBlogData(data);
            console.log("BLOG IMAGE URL:", data.image_url);
            console.log('VIEW', data);
        }
    }
     fetchBlog();
    },[id]);

        const fetchComments = async () => {
      if (!blog?.id){
        return
      };

      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("blog_id", blog.id)
        .order("created_at", { ascending: true });

      if (!error && data) setComments(data);
    };

    
    useEffect(() => {
      fetchComments();
    }, [blog?.id]);

  const handleAddComment = async () => {
  let imageUrl: string | null = null;

  if (commentImage) {
    const fileName = `${Date.now()}-${commentImage.name}`;

    const { error: uploadError } = await supabase.storage
      .from("comment-image")
      .upload(fileName, commentImage);

    if (uploadError) return alert("Image upload failed");

    const { data } = supabase.storage
      .from("comment-image")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase.from("comments").insert({
    blog_id: blog?.id,
    author_id: user.id,
    content: commentText,
    image_url: imageUrl,
  });

  if (!error) {
    setCommentText("");
    setCommentImage(null);
    fetchComments(); 
  }
};

      const handleDelete = async () => {
      if (!id) return;

      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
      } else {
        alert("Blog Deleted");
        navigate("/home");
      }
    };


    return (
  <Container className="mt-5">
    <Row className="justify-content-center">
      {blog && (
        <Col md={6} lg={4} className="mb-4">
          <div className="card">
            {blog.image_url && (
              <img
                src={blog.image_url}
                className="card-img-top"
                style={{ height: "200px", width: "100%", objectFit: "cover" }}
                alt="Blog image"
              />
            )}

            <div className="card-header text-center">{blog.title}</div>
            <div className="card-body">
              <p className="card-text">{blog.content}</p>

              {/* Edit/Delete Buttons */}
              <div className="d-flex justify-content-center mt-2">
                <Button
                  variant="primary"
                  onClick={() => navigate(`/update/${blog.id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="card-footer mt-2">
              <h6>Comments</h6>
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded p-2 mb-2">
                  <p className="mb-1">{comment.content}</p>

                  {comment.image_url && (
                    <img
                      src={comment.image_url}
                      style={{
                        maxWidth: "100%",
                        height: "150px",
                        objectFit: "cover",
                        marginTop: "5px",
                      }}
                      alt="Comment"
                    />
                  )}
                </div>
              ))}
              <textarea
                className="form-control mt-2"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="d-flex align-items-center mt-2">
                <input
                  type="file"
                  id="commentImageUpload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    setCommentImage(e.target.files?.[0] || null)
                  }
                />

                <label
                  htmlFor="commentImageUpload"
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-paperclip" style={{ fontSize: "1.5rem" }}></i>
                </label>
                {commentImage && (
                  <span style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
                    {commentImage.name}
                  </span>
                )}
              </div>
              <button
                className="btn btn-primary mt-2 w-100"
                onClick={handleAddComment}
              >
                Comment
              </button>
            </div>

          </div>
        </Col>
      )}
    </Row>
  </Container>
);
}

export default ViewBlog;