# Task Manager Frontend

A modern task management application built with React, Tailwind CSS, and React Query.

## Features

- User authentication (login/register)
- Task management (create, read, update, delete)
- Task filtering and sorting
- Tag management
- Real-time notifications
- User profile management
- Responsive design

## Tech Stack

- React 18
- Tailwind CSS
- React Query (TanStack Query)
- React Router
- React Hook Form
- Yup (form validation)
- Axios
- React Hot Toast

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd task-manager/client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following:

```
VITE_API_URL=http://localhost:5000
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `dist` directory.

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── context/       # React context providers
  ├── pages/         # Page components
  ├── services/      # API services
  ├── utils/         # Utility functions
  ├── App.jsx        # Main application component
  └── main.jsx       # Application entry point
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5000`. Make sure the backend server is running before starting the frontend application.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
