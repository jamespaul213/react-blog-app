import { supabase } from "../Api/supaBaseClient2";

const signUp = async(email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });
    
    if(error){
        console.log(error.message)
    }else{
        console.log('User signed up:', data.user);
    }
}