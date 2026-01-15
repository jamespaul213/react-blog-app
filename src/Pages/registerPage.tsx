import React, { useState } from "react";
import { supabase } from "../Api/supaBaseClient";
import { RegistrationData } from "../Types/regitrationData";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom";



const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<RegistrationData>({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
    await supabase.auth.signOut();

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      alert("Registration successful! Check your email for confirmation.");
      console.log(data);
      navigate("/login")
    }
  };
    

  return (
  <Container className="mt-5">
  <Row className="justify-content-md-center">
    <Col md={6}>
      <h2 className="mb-4">Register</h2>
      <Form onSubmit={handleSubmit}>
        
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

    
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

       
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

      
        <Form.Group className="mb-3" controlId="formPhone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="number"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </Form.Group>

      
        <Button variant="primary" type="submit" disabled={loading} className="w-100">
          {loading ? "Registering..." : "Register"}
        </Button>

    
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Form>
    </Col>
  </Row>
</Container>
  );

}
export default RegistrationForm;