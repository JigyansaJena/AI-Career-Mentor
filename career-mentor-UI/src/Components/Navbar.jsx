import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">🧠 CareerMentor</div>

      <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span>📄</span> Resume
      </NavLink>
      <NavLink to="/skills" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span>📊</span> Skill Gap
      </NavLink>
      <NavLink to="/roadmap" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span>🗺️</span> Roadmap
      </NavLink>
      <NavLink to="/interview" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span>🎤</span> Interview
      </NavLink>

      <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid #2d3748' }}>
        <div style={{ fontSize: 12, color: '#718096', marginBottom: 4 }}>Logged in as</div>
        <div style={{ fontSize: 13, color: '#a0aec0', fontWeight: 600 }}>{user.name}</div>
        <div style={{ fontSize: 11, color: '#4a5568' }}>{user.targetRole}</div>
      </div>
      <button className="nav-logout" onClick={logout}>🚪 Logout</button>
    </nav>
  );
}
