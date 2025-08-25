# Government Document Management System

A secure MERN stack application for managing and sharing government documents with family members using Aadhaar-based authentication and OTP verification.

## 🔹 Features

### Authentication & Security
- JWT-based authentication with Aadhaar number as unique identifier
- Email OTP verification for secure access
- Password encryption using bcryptjs
- Rate limiting and security headers (Helmet)
- Comprehensive audit logging of all user actions

### Document Management
- Upload, view, update, and delete government documents
- Support for multiple document types (PAN, Aadhaar, Passport, etc.)
- File type validation (JPEG, PNG, PDF, DOC)
- Secure file storage with organized directory structure
- Document metadata management (issue date, expiry, authority)

### Sharing & Collaboration
- Share documents with family members using Aadhaar numbers
- Permission-based access control (view, download)
- Shared document notifications and tracking

### User Interface
- Responsive design with Tailwind CSS
- Modern, government-inspired design theme
- Intuitive document management interface
- Real-time notifications using React Hot Toast
- Mobile-friendly responsive layouts

## 🔹 Technology Stack

### Backend
- **Node.js** + **Express.js** - REST API server
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email sending for OTP
- **Winston** - Logging framework
- **Helmet** - Security middleware

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## 🔹 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Gmail account for SMTP (for OTP emails)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_complex
JWT_EXPIRE=7d
MONGO_URI=mongodb://localhost:27017/govt_docs
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
OTP_EXPIRY=300000
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm run dev
```

### MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `govt_docs`
3. The application will automatically create the required collections

## 🔹 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP

### Documents
- `GET /api/documents` - Get user documents
- `POST /api/documents` - Upload document
- `GET /api/documents/:id` - Get specific document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/share` - Share document
- `GET /api/documents/shared` - Get shared documents
- `GET /api/documents/:id/download` - Download document

### Users
- `GET /api/users/search` - Search users by Aadhaar
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id` - Get user profile

### Logs
- `GET /api/logs` - Get system logs (admin only)
- `GET /api/logs/user/:userId` - Get user activity logs
- `GET /api/logs/stats` - Get logging statistics

## 🔹 Project Structure

```
govt-doc-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── documents.js
│   │   ├── users.js
│   │   └── logs.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Document.js
│   │   └── Log.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── documents.js
│   │   ├── users.js
│   │   └── logs.js
│   ├── utils/
│   │   ├── email.js
│   │   ├── fileUpload.js
│   │   ├── logger.js
│   │   └── logger.service.js
│   ├── uploads/ (created automatically)
│   ├── logs/ (created automatically)
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Common/
│   │   │   └── Layout/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Documents/
│   │   │   └── Profile/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   └── package.json
└── README.md
```

## 🔹 Security Features

- **Password Encryption**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **OTP Verification**: Email-based two-factor authentication
- **File Type Validation**: Only allowed file types can be uploaded
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Configured for specific origins
- **Security Headers**: Helmet middleware for security headers
- **Input Validation**: Joi validation for all inputs
- **Audit Logging**: Complete activity logging for compliance

## 🔹 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
MONGO_URI=mongodb://localhost:27017/govt_docs
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
OTP_EXPIRY=300000
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🔹 Usage

1. **Register**: Create account with Aadhaar number and personal details
2. **Verify**: Complete OTP verification via email
3. **Upload**: Add government documents with metadata
4. **Manage**: View, edit, and organize your documents
5. **Share**: Share documents with family members using their Aadhaar numbers
6. **Access**: View documents shared with you by others

## 🔹 Supported Document Types

- PAN Card
- Aadhaar Card
- Passport
- Driving License
- Voter ID Card
- Mark Sheets
- Degree Certificates
- Income Certificates
- Caste Certificates
- Birth Certificates

## 🔹 File Upload Specifications

- **Supported formats**: JPEG, PNG, PDF, DOC, DOCX
- **Maximum file size**: 10MB
- **Storage**: Local filesystem with organized user directories
- **Security**: File type validation and secure file handling

## 🔹 Development Guidelines

1. **Code Organization**: Modular architecture with clear separation of concerns
2. **Error Handling**: Comprehensive error handling with meaningful messages
3. **Logging**: Detailed logging for debugging and audit trails
4. **Testing**: Write tests for critical functionality
5. **Security**: Follow security best practices for sensitive data handling

## 🔹 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🔹 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔹 Support

For support or questions, please create an issue in the GitHub repository or contact the development team.

---

**🔒 Security Notice**: This application handles sensitive government documents. Ensure proper security measures are in place before deploying to production, including SSL certificates, secure server configuration, and regular security audits.