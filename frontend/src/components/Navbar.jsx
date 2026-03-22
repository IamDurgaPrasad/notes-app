import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, StickyNote } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <StickyNote size={22} />
        <span>NoteApp</span>
      </div>
      <div className="nav-right">
        <span className="nav-user">Hi, {user?.name}</span>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}