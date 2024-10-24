import { Link } from 'react-router-dom';
import reactLogo from '../assets/react.svg'
import profile from '../assets/user-regular.svg'
import '../css/navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={reactLogo} alt="Home" className="logo" />
      </Link>

      {/* Profile Icon */}
      <div className="navbar-profile">
        <Link to="/profile">
          <img src={profile} alt="Profile" className="profile-icon" />
        </Link>
      </div>
    </nav>
  );
}
