import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaSearch, FaBook, FaPlus } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          🎨 Artisan Platform
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>
              <FaHome /> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/artisans" className="nav-link" onClick={closeMenu}>
              <FaSearch /> Find Artisans
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/resources" className="nav-link" onClick={closeMenu}>
              <FaBook /> Resources
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              {user?.role === 'artisan' && (
                <>
                  <li className="nav-item">
                    <Link to="/artisan-dashboard" className="nav-link" onClick={closeMenu}>
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/my-products" className="nav-link" onClick={closeMenu}>
                      My Products
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/add-product" className="nav-link" onClick={closeMenu}>
                      <FaPlus /> Add Product
                    </Link>
                  </li>
                </>
              )}

              {user?.role === 'buyer' && (
                <li className="nav-item">
                  <Link to="/buyer-dashboard" className="nav-link" onClick={closeMenu}>
                    Dashboard
                  </Link>
                </li>
              )}

              {user?.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin-dashboard" className="nav-link" onClick={closeMenu}>
                    Admin Dashboard
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <Link to="/my-requests" className="nav-link" onClick={closeMenu}>
                  My Requests
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={closeMenu}>
                  <FaUser /> Profile
                </Link>
              </li>

              <li className="nav-item">
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>

              <li className="nav-item user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link btn-register" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;