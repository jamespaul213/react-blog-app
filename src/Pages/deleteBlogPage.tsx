import React, {useEffect} from "react";
import { supabase } from "../Api/supaBaseClient";
import { useParams, useNavigate } from "react-router-dom";

const DeleteBlog: React.FC = () => {
    const { id } = useParams<{ id:string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const deleteBlog = async () => {
            if(!id) return;

            const{data, error} = await supabase
            .from("blogs")
            .delete()
            .eq("id",id);

            if(error){
                console.log(error)
            }else{
                alert("Blog Deleted")
                navigate("/")
            }
        }
        deleteBlog();
    }, [id, navigate])

    return(
        <div>
        <h1>Delete Blog</h1>
        </div>
    )

}
export default DeleteBlog;