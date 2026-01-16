import React, { useState }  from "react";
import { supabase } from "../Api/supaBaseClient";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap"

const LogIn: React.FC = () => {

      const [formData, setFormData] = useState({
        email: "",
        password: "",
      })
    const navigate = useNavigate();
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
      navigate("/home")
    }

    }
    return(
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4">Log In</h2>
          <Form onSubmit={handleLogin}>
            
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
    
    
          
            <Button variant="primary" type="submit" disabled={loading} className="w-100">
              {loading ? "Logging In..." : "Log In"}
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
    )

}
export default LogIn;
