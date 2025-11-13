# Skill-Matching and Market Access Platform for Local Artisans

A comprehensive web platform connecting local artisans with buyers, featuring profile management, product listings, commission requests, and training resources.

## Features

### In-Scope Features
- ✅ Artisan Registration & Profile Management
- ✅ Product/Service Listings with Images
- ✅ Buyer Module with Search & Filters
- ✅ Admin Dashboard for Management
- ✅ Training & Resources Section
- ✅ Responsive Design (Mobile & Desktop)

### Future Enhancements
- 💳 Full e-commerce with payment gateway
- 💬 Real-time chat/messaging
- 🤖 AI-powered recommendations
- 📊 Advanced analytics dashboards

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (File Uploads)
- bcrypt (Password Hashing)

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/22is067/artisan-connect.git
cd artisan-connect
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/artisan-platform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create `.env` file in client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Default Admin Credentials
After first run, create admin account or use:
- Email: admin@artisan.com
- Password: admin123 (Change immediately!)

## Project Structure

```
artisan-connect/
├── client/                      # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ProductCard.js
│   │   │   └── ArtisanCard.js
│   │   ├── pages/             # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── ArtisanDashboard.js
│   │   │   ├── BuyerDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── Resources.js
│   │   ├── context/           # Context API
│   │   │   └── AuthContext.js
│   │   ├── services/          # API services
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                     # Node.js Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── artisanController.js
│   │   ├── productController.js
│   │   ├── requestController.js
│   │   ├── resourceController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Request.js
│   │   └── Resource.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── artisan.js
│   │   ├── product.js
│   │   ├── request.js
│   │   ├── resource.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/              # Uploaded files
│   ├── server.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Artisans
- GET `/api/artisans` - Get all artisans
- GET `/api/artisans/:id` - Get artisan by ID
- PUT `/api/artisans/:id` - Update artisan profile
- GET `/api/artisans/search` - Search artisans

### Products
- GET `/api/products` - Get all products
- POST `/api/products` - Create product
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product

### Requests
- GET `/api/requests` - Get user requests
- POST `/api/requests` - Create commission request
- PUT `/api/requests/:id` - Update request status

### Resources
- GET `/api/resources` - Get all resources
- POST `/api/resources` - Create resource (Admin)
- PUT `/api/resources/:id` - Update resource (Admin)
- DELETE `/api/resources/:id` - Delete resource (Admin)

### Admin
- GET `/api/admin/users` - Get all users
- PUT `/api/admin/users/:id/verify` - Verify artisan
- GET `/api/admin/stats` - Get system statistics

## Usage Guide

### For Artisans
1. Register as an artisan
2. Complete your profile with skills and portfolio
3. Add products/services with images and prices
4. Receive and manage commission requests
5. Access training resources

### For Buyers
1. Register as a buyer
2. Search for artisans by skill or location
3. View artisan profiles and portfolios
4. Send commission requests
5. Track request status

### For Admins
1. Login with admin credentials
2. Review and verify artisan registrations
3. Monitor all commission requests
4. Manage training resources
5. View system statistics

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation and sanitization
- CORS protection

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License
MIT License

## Contact
For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for local artisans by 22is067