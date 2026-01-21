import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Blog } from "../Types/blog";
import { supabase } from "../Api/supaBaseClient";
import { Button, Container, Row, Col, Pagination } from 'react-bootstrap';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]); 
    const [page, setPage] = useState(1);
    const pageSize = 3;
    const [totalBlogs, setTotalBlogs] = useState(0);
    const hasNextPage = blogs.length === pageSize;

useEffect(() => {
  const fetchBlogs = async () => {
    // const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(
        (page - 1) * pageSize,
        page * pageSize - 1
      );


    // if (user) {
    //   query = query.eq("author_id", user.id);
    // }

    const { data, error, count } = await query;

    if (!error){
    setBlogs(data || []);
    console.log('DATA',data)
    setTotalBlogs(count || 0);
    }
  };

  fetchBlogs();
}, [page]);


   return (
  <Container className="mt-5">
    <div  className="create-button d-flex justify-content-end">
          <Button
              variant="primary"
              onClick={() => navigate(`/create`)}
            >Create New Blog
        </Button>
    </div>
  <Row>
    {blogs.map((blog) => (
      <Col key={blog.id} md={6} lg={4} className="mb-4">
        <div className="card" style={{ width: "18rem" }}>
            {blog.image_url && (
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
            <h5 className="card-header d-flex justify-content-center">{blog.title}</h5>
        <div className="d-flex justify-content-center card-body">
            <Button
              variant="primary"
              onClick={() => navigate(`/view/${blog.id}`)}
            >View Blog
            </Button>
        </div>
        </div>
      </Col>
    ))}
  </Row>
  {totalBlogs > pageSize && (
    <Pagination className="justify-content-center mt-4">
    <Pagination.Prev
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
    />
    <Pagination.Item active>{page}</Pagination.Item>
    <Pagination.Next  disabled={!hasNextPage} onClick={() => setPage(page + 1)} />
  </Pagination>
  )}
</Container>
  );
};

export default LandingPage;