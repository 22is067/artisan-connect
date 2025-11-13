import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArtisanDashboard from './pages/ArtisanDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ArtisanProfile from './pages/ArtisanProfile';
import ProductDetails from './pages/ProductDetails';
import SearchArtisans from './pages/SearchArtisans';
import Resources from './pages/Resources';
import MyProducts from './pages/MyProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import MyRequests from './pages/MyRequests';
import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/artisans" element={<SearchArtisans />} />
              <Route path="/artisan/:id" element={<ArtisanProfile />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/resources" element={<Resources />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="" element={<DashboardRedirect />} />
              </Route>
              
              <Route path="/artisan-dashboard" element={<PrivateRoute roles={['artisan']} />}>
                <Route path="" element={<ArtisanDashboard />} />
              </Route>
              
              <Route path="/buyer-dashboard" element={<PrivateRoute roles={['buyer']} />}>
                <Route path="" element={<BuyerDashboard />} />
              </Route>
              
              <Route path="/admin-dashboard" element={<PrivateRoute roles={['admin']} />}>
                <Route path="" element={<AdminDashboard />} />
              </Route>
              
              <Route path="/my-products" element={<PrivateRoute roles={['artisan']} />}>
                <Route path="" element={<MyProducts />} />
              </Route>
              
              <Route path="/add-product" element={<PrivateRoute roles={['artisan']} />}>
                <Route path="" element={<AddProduct />} />
              </Route>
              
              <Route path="/edit-product/:id" element={<PrivateRoute roles={['artisan']} />}>
                <Route path="" element={<EditProduct />} />
              </Route>
              
              <Route path="/my-requests" element={<PrivateRoute />}>
                <Route path="" element={<MyRequests />} />
              </Route>
              
              <Route path="/profile" element={<PrivateRoute />}>
                <Route path="" element={<Profile />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Helper component to redirect to appropriate dashboard
function DashboardRedirect() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) return <Navigate to="/login" />;
  
  switch(user.role) {
    case 'artisan':
      return <Navigate to="/artisan-dashboard" />;
    case 'buyer':
      return <Navigate to="/buyer-dashboard" />;
    case 'admin':
      return <Navigate to="/admin-dashboard" />;
    default:
      return <Navigate to="/" />;
  }
}

export default App;