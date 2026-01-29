<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb&theme=dark" alt="Node.js, Express, MongoDB" width="180">

# School MIS API

A comprehensive School Management Information System REST API built with Node.js, Express, and MongoDB

[![Stars](https://img.shields.io/github/stars/achille010/mis-demo?style=flat)](https://github.com/achille010/mis-demo/stargazers)
[![License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat)](LICENSE)

</div>

## Overview

A fully-featured backend REST API for managing schools, academic levels, classes, students, teachers, and courses. Built with modern Node.js practices, including JWT authentication, request validation, and comprehensive API documentation with Swagger UI.

## Key Features

- **RESTful API Architecture**: Clean, organized endpoints following REST principles
- **JWT Authentication**: Secure token-based authentication system
- **MongoDB Database**: NoSQL database with Mongoose ODM
- **Request Validation**: Input validation using Joi schemas
- **API Documentation**: Interactive Swagger UI documentation
- **Comprehensive CRUD**: Full create, read, update, delete operations for all entities
- **Logging**: Request logging with Morgan and debugging support
- **Error Handling**: Centralized error handling middleware

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **Documentation**: Swagger UI
- **Logging**: Morgan, Debug

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/achille010/mis-demo.git
cd mis-demo
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (if available)
   - Or update `config/default.json` with your settings

4. Ensure MongoDB is running:
```bash
# Default connection: mongodb://localhost:27017
# Update in config/default.json if using a different connection
```

5. Seed the database with admin user (recommended):
```bash
npm run seed
```

This creates a default admin account:
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@school.com`

6. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will be running at `http://localhost:3000`

## API Documentation

Interactive Swagger UI documentation is available at:

**`http://localhost:3000/api-docs`**

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login (get JWT token)
- `POST /api/v1/auth/logout` - User logout

### Schools
- `GET /api/v1/schools` - Get all schools
- `GET /api/v1/schools/:id` - Get school by ID
- `POST /api/v1/schools` - Create new school
- `PUT /api/v1/schools/:id` - Update school
- `DELETE /api/v1/schools/:id` - Delete school

### Levels
- `GET /api/v1/levels` - Get all academic levels (Senior 4, 5, 6)
- `GET /api/v1/levels/:id` - Get level by ID
- `POST /api/v1/levels` - Create new level
- `PUT /api/v1/levels/:id` - Update level
- `DELETE /api/v1/levels/:id` - Delete level

### Classes
- `GET /api/v1/classes` - Get all classes
- `GET /api/v1/classes/:id` - Get class by ID
- `POST /api/v1/classes` - Create new class
- `PUT /api/v1/classes/:id` - Update class
- `DELETE /api/v1/classes/:id` - Delete class

### Students
- `GET /api/v1/students` - Get all students
- `GET /api/v1/students/:id` - Get student by ID
- `POST /api/v1/students` - Register new student
- `PUT /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student

### Teachers
- `GET /api/v1/teachers` - Get all teachers
- `GET /api/v1/teachers/:id` - Get teacher by ID
- `POST /api/v1/teachers` - Add new teacher
- `PUT /api/v1/teachers/:id` - Update teacher
- `DELETE /api/v1/teachers/:id` - Delete teacher

### Courses
- `GET /api/v1/courses` - Get all courses
- `GET /api/v1/courses/:id` - Get course by ID
- `POST /api/v1/courses` - Create new course
- `PUT /api/v1/courses/:id` - Update course
- `DELETE /api/v1/courses/:id` - Delete course

## Authentication

Most endpoints require JWT authentication. Include the token in your requests using either:

**Option 1: Authorization header (recommended)**
```bash
Authorization: Bearer <your-token>
```

**Option 2: Custom header**
```bash
x-auth-token: <your-token>
```

## Usage Examples

### Login to get JWT token
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Create a new school
```bash
curl -X POST http://localhost:3000/api/v1/schools \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Example High School",
    "address": "123 Main Street",
    "email": "info@example.com",
    "principalName": "John Doe"
  }'
```

### Get all students
```bash
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer <your-token>"
```

## Project Structure

```
mis-demo/
├── config/                 # Configuration files
│   ├── database.js
│   ├── swagger.js
│   ├── default.json
│   └── development.json
├── controllers/            # Request handlers
│   ├── authController.js
│   ├── schoolController.js
│   ├── levelController.js
│   ├── classController.js
│   ├── studentController.js
│   ├── teacherController.js
│   └── courseController.js
├── middleware/             # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── validate.js
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── School.js
│   ├── Level.js
│   ├── Class.js
│   ├── Student.js
│   ├── Teacher.js
│   └── Course.js
├── routes/                 # API routes
│   ├── index.js
│   ├── authRoutes.js
│   ├── schoolRoutes.js
│   └── ...
├── scripts/                # Utility scripts
├── validations/            # Joi validation schemas
│   ├── authValidation.js
│   ├── schoolValidation.js
│   └── ...
├── frontend/               # Frontend files (if any)
├── server.js               # Application entry point
└── package.json            # Project dependencies
```

## Configuration

Customize settings in `config/default.json`:

- **Server Port**: Default is 3000
- **MongoDB URI**: Connection string for database
- **JWT Secret**: Secret key for token signing
- **JWT Expiration**: Token validity period
- **Swagger Settings**: API documentation host and base path

## Database Models

The system includes the following MongoDB collections:

- **Users**: Admin users with authentication
- **Schools**: School information and details
- **Levels**: Academic levels (Senior 4, 5, 6)
- **Classes**: Class information linked to levels
- **Students**: Student records with class assignments
- **Teachers**: Teacher profiles and information
- **Courses**: Course details and curriculum

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**achille010**

- GitHub: [@achille010](https://github.com/achille010)

## Acknowledgments

Built as a comprehensive demonstration of modern Node.js backend development practices, RESTful API design, and MongoDB database integration for educational management systems.

---

<div align="center">

Made with ❤️ using Node.js, Express & MongoDB

</div>