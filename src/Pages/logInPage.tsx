import React, { useState }  from "react";
import { supabase } from "../Api/supaBaseClient";

const LogIn: React.FC = () => {

      const [formData, setFormData] = useState({
        email: "",
        password: "",
      })
      
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
    setError(null);

     const {data, error} = await supabase.auth.signInWithPassword({
        email:formData.email,
        password:formData.password,
    });    
     setLoading(false);

      if (error) {
      setError(error.message);
    } else {
      alert("Log In successful!");
      console.log(data);
    }

    }
    return(
        <div>
         <form onSubmit={handleLogin}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "LogIn"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
        </div>
    )

}
export default LogIn;
