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
    const [editStatus, setEditStatus] = useState<boolean>(false);
    const [originalText, setOriginalText] = useState("");
    const [commentImage, setCommentImage] = useState<File | null>(null);
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
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

      setEditImageFile(null); 
      setEditStatus(true);
      };


      const cancelEdit = () => {
      setEditingId(null);
      setEditText(originalText);
      setEditStatus(false);

      setEditImageFile(null);  
      };

  const saveEdit = async (commentId: string, authorId: string, oldImageUrl: string | null) => {
  if (currentUser?.id !== authorId) return;

   if (!editText.trim() && !editImageFile) {
    alert("Comment cannot be empty");
    return;
  }

  let finalImageUrl = oldImageUrl;

  if (editImageFile) {
    if (oldImageUrl) {
      const oldPath = oldImageUrl.split("/comment-image/")[1];
      await supabase.storage.from("comment-image").remove([oldPath]);
    }


    const fileName = `comment-${commentId}-${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from("comment-image")
      .upload(fileName, editImageFile);

    if (uploadError) {
      alert("Image upload failed");
      return;
    }

    const { data } = supabase.storage
      .from("comment-image")
      .getPublicUrl(fileName);

    finalImageUrl = data.publicUrl;
  }


  const { error } = await supabase
    .from("comments")
    .update({
      content: editText,
      image_url: finalImageUrl,
    })
    .eq("id", commentId);

  if (error) return alert("Update failed");


  setComments((prev) =>
    prev.map((c) =>
      c.id === commentId
        ? { ...c, content: editText, image_url: finalImageUrl }
        : c
    )
  );

  setEditingId(null);
  setEditStatus(false);
  setEditImageFile(null);
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

      const handleDeleteImage = async (imageUrl: string, authorId: string) => {
        if(currentUser.id !== authorId) return;

        const { error } = await supabase.storage
        .from("comment-image")
        .remove([imageUrl]);

        if (!error) {
          await supabase
          .from("comments")
          .update({ image_url: null })
          .eq("image_url", imageUrl);

          setComments((prev) =>
          prev.map((c) =>
          c.image_url === imageUrl ? { ...c, image_url: null } : c
          )
          );
        }
      }


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

                  {editingId === comment.id? (
                    <>
                      <textarea
                        className="form-control mb-2"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => saveEdit(comment.id, comment.author_id, comment.image_url)}
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

                    
                        <input
                          type="file"
                          style={{ display: "none" }}
                          id={`updateImage-${comment.id}`}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setEditImageFile(file);
                          }}
                        />
                        <label
                          htmlFor={`updateImage-${comment.id}`}
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        >
                          <i className="bi bi-paperclip" style={{ fontSize: "1.5rem" }}></i>
                        </label>
                        {editImageFile && (
                          <span style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
                            {editImageFile.name}
                          </span>
                )}
                      
                    </>
                  ) : (
                    <>
                      <p className="mb-1">{comment.content}</p>
                      {currentUser?.id === comment.author_id && comment.image_url === null && (
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

              {comment.image_url != null && (
                  <div className="image-wrapper">
                  <img
                  src={
                    editingId === comment.id && editImageFile
                      ? URL.createObjectURL(editImageFile)
                      : comment.image_url || ""
                  }
                  className="comment-image"
                  alt="Comment"
                />
                  {currentUser?.id === comment.author_id && editStatus === true && (
                    <button
                    className="delete-image-btn"
                    onClick={() => {
                    if (comment.image_url != null) {
                    handleDeleteImage(comment.image_url, comment.author_id);
                    }
                    }}
                    >
                    ✕
                    </button>
                  )}
                  <div>
                  
                      {currentUser?.id === comment.author_id && editStatus === false && (
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
                  </div>
                  </div>
                  )}
                </div>
              ))}
            </div>
            {editStatus === false && (
              <>
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
                 </>
            )}
            </div>
            
        </Col>
      )}
    </Row>
  </Container>
);
}

export default ViewBlog;