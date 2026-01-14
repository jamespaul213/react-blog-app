import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './Pages/landingPage';
import CreateBlog from './Pages/createBlogPage';
import DeleteBlog from './Pages/deleteBlogPage';
import UpdateBlog from './Pages/updateBlogPage';
import LogIn from './Pages/logInPage';
import RegistrationForm from './Pages/registerPage';
import Header from './Components/header';
import ViewBlog from './Pages/viewBlogPage';



function App() {
  return (
    <Router>
       <Header />
      <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/update/:id" element={<UpdateBlog />} />
            <Route path="/delete/:id" element={<DeleteBlog />} />
            <Route path="/view/:id" element={<ViewBlog />} />
      </Routes>
    </ Router>
  );
}

export default App;
