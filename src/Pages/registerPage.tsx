import React, { useState } from "react";
import { supabase } from "../Api/supaBaseClient";
import { RegistrationData } from "../Types/regitrationData";


const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<RegistrationData>({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
          options: {
      data: {
        display_name: formData.name,
        Phone: formData.phone,
      },
    },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      alert("Registration successful! Check your email for confirmation.");
      console.log(data);
    }
  };
    

    return (
    <form onSubmit={handleSubmit}>
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
        <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
        <input
        type="number"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );

}
export default RegistrationForm;