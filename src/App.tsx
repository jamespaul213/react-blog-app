import './App.css';
import React,{ useEffect } from 'react';
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './Pages/landingPage';
import CreateBlog from './Pages/createBlogPage';
import DeleteBlog from './Pages/deleteBlogPage';
import UpdateBlog from './Pages/updateBlogPage';
import LogIn from './Pages/logInPage';
import RegistrationForm from './Pages/registerPage';
import Header from './Components/header';
import ViewBlog from './Pages/viewBlogPage';
import { Container } from 'react-bootstrap';
import { supabase } from './Api/supaBaseClient';
import { setUser } from './Redux/authSlice'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {

  supabase.auth.getUser().then(result => {
    dispatch(setUser(result.data.user));
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    dispatch(setUser(session ? session.user : null));
  });

  return () => {
    subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <Router>
       <Header />
       <div className="container-md">
      <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/update/:id" element={<UpdateBlog />} />
            <Route path="/delete/:id" element={<DeleteBlog />} />
            <Route path="/view/:id" element={<ViewBlog />} />
      </Routes>
   </div>   
    </ Router>
  );
}

export default App;
