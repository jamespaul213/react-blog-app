import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './Pages/landingPage';
import CreateBlog from './Pages/createBlogPage';
import DeleteBlog from './Pages/deleteBlogPage';
import EditBlog from './Pages/editBlogPage';
import LogIn from './Pages/logInPage';
import RegistrationForm from './Pages/registerPage';



function App() {
  return (
    <Router>
      <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="login" element={<LogIn />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="create" element={<CreateBlog />} />
      </Routes>
    </ Router>
  );
}

export default App;
