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
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [originalText, setOriginalText] = useState("");
    const [commentImage, setCommentImage] = useState<File | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const navigate = useNavigate();

      useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
    setCurrentUser(data.user);
    });
    }, []);
    

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
        }
    }
     fetchBlog();
    },[id]);
    
    useEffect(() => {
       const fetchComments = async () => {
        if (!blog?.id) return;

      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("blog_id", blog?.id)
        .order("created_at", { ascending: true });

      if (!error && data) setComments(data);
    };

      fetchComments();
    }, [blog?.id]);
    
    
  const handleAddComment = async () => {
  if (!blog) return;

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
    blog_id: blog.id,
    author_id: user.id,
    content: commentText,
    image_url: imageUrl,
    comment_name: user.email,
  });

      if (!error) {
    setCommentText("");
    setCommentImage(null);


    // re-fetch real comments from DB
    const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("blog_id", blog.id)
    .order("created_at", { ascending: true });


    setComments(data || []);
    }
  };

      const startEdit = (comment: Comment) => {
      setEditingId(comment.id);
      setEditText(comment.content);
      setOriginalText(comment.content);
      };

      const cancelEdit = () => {
      setEditingId(null);
      setEditText(originalText);
      };

   const saveEdit = async (commentId: string, authorId: string) => {
    if (currentUser?.id !== authorId) return;


    const { error } = await supabase
    .from("comments")
    .update({ content: editText })
    .eq("id", commentId);


    if (!error) {
    setComments((prev) =>
    prev.map((c) =>
    c.id === commentId ? { ...c, content: editText } : c
    )
    );
    setEditingId(null);
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

    const handleDeleteComment = async (commentId: string, authorId: string) => {
      if (currentUser?.id !== authorId) return;


      const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);


      if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
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
                alt="Placeholder"
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
                  <h3 className="mb-1 text-primary fs-6">
                    {comment.comment_name || "Anonymous"}
                  </h3>

                  {editingId === comment.id ? (
                    <>
                      <textarea
                        className="form-control mb-2"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => saveEdit(comment.id, comment.author_id)}
                      >
                        Save
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        className="ms-2"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="mb-1">{comment.content}</p>
                    {currentUser?.id === comment.author_id && (
                      <div className="d-flex gap-2 mt-2">
                      <Button
                      size="sm"
                      variant="primary"
                      onClick={() => startEdit(comment)}
                      >
                      Edit
                      </Button>


                      <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteComment(comment.id, comment.author_id)}
                      >
                      Delete
                      </Button>
                      </div>
                      )}
                    </>
                  )}

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