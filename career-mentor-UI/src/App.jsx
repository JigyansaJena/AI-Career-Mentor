import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Resume from './Pages/Resume';
import SkillGap from './Pages/SkillGap';
import Roadmap from './Pages/Roadmap';
import Interview from './Pages/Interview';
import Navbar from './Components/Navbar';
import './App.css';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? (
    <div className="app-layout">
      <Navbar />
      <div className="page-content">{children}</div>
    </div>
  ) : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Resume /></PrivateRoute>} />
        <Route path="/skills" element={<PrivateRoute><SkillGap /></PrivateRoute>} />
        <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
        <Route path="/interview" element={<PrivateRoute><Interview /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
