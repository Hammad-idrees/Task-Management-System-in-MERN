# Task Manager Application

A full-stack task management application built with React, Node.js, and MongoDB. This application helps users organize their tasks, set priorities, manage tags, and track their progress with a beautiful and intuitive interface.

## Features

### Frontend Features
- 🎨 Modern and responsive UI with Tailwind CSS
- 🌓 Dark/Light mode support
- 📱 Mobile-first design
- 🔄 Real-time updates with React Query
- 🔒 Secure authentication with JWT
- 📊 Interactive dashboard with task statistics
- 🏷️ Tag management system
- 📅 Task scheduling and due dates
- 🔔 Real-time notifications
- 🤖 AI-powered task assistant
- 📤 Export tasks to PDF and CSV
- 🌐 Multi-language support
- ⚡ Optimized performance

### Backend Features
- 🔐 JWT-based authentication
- 📝 RESTful API architecture
- 🗄️ MongoDB database integration
- 🔄 Real-time notifications
- 📊 Data validation and sanitization
- 🔒 Secure password hashing
- 📤 File export functionality
- 🤖 AI integration for task assistance
- 📈 Performance optimization
- 🔍 Advanced search capabilities

## Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Framer Motion
- React Query
- React Hot Toast
- Heroicons
- Material-UI Date Pickers
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- PDFKit
- Bcrypt
- Express Validator
- Cors
- Dotenv

## Prerequisites

Before running the application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hammad-idrees/task-manager.git
cd task-manager
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Mode

1. Build the frontend:
```bash
cd client
npm run build
```

2. Start the production server:
```bash
cd server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create a new tag
- `PUT /api/tags/:id` - Update a tag
- `DELETE /api/tags/:id` - Delete a tag

### Notifications
- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete a notification

### Export
- `GET /api/export/pdf` - Export tasks to PDF
- `GET /api/export/csv` - Export tasks to CSV

## Project Structure

```
task-manager/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # Reusable components
│       ├── context/       # React context providers
│       ├── pages/         # Page components
│       ├── services/      # API services
│       └── utils/         # Utility functions
│
└── server/                # Backend Node.js application
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── middleware/       # Custom middleware
    ├── models/          # Database models
    ├── routes/          # API routes
    └── utils/           # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)
