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
                navigate("/home")
                 alert("Blog Deleted")
            }
        }
    }, [id, navigate])

    return(
        <div>
        </div>
    )

}
export default DeleteBlog;