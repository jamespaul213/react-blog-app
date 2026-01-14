import React, {useEffect,useState} from "react";
import {  Button,  Col } from "react-bootstrap"
import { useNavigate, useParams} from "react-router-dom";
import { supabase } from "../Api/supaBaseClient";
import { Blog } from "../Types/blog";


const ViewBlog: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [blog, setBlogData] = useState<Blog | null>(null);
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
            console.log('VIEW', data);
        }
    }
     fetchBlog();
    },[id]);

    return(
        <div>
      <Col key={blog?.id} md={6} lg={4} className="mb-4">
             <div className="card" style={{ width: "18rem" }}>
             <div className="card-body">
                 <h5 className="card-title">Title:{blog?.title}</h5>
                 <p className="card-text">Content:{blog?.content}</p>
                 <Button
                   variant="primary"
                   onClick={() => navigate(`/update/${blog?.id}`)}
                 >
                   Edit
                 </Button>
                 <Button
                   variant="danger"
                   className="ms-2"
                  onClick={() => navigate(`/delete/${blog?.id}`)}
                 >
                   Delete
                 </Button>
             </div>
             </div>
           </Col> 
           </div> 
    )
}

export default ViewBlog;