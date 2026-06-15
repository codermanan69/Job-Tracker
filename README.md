# Job Tracker

A full-stack Job Application Tracking System designed to help developers and job seekers organize, track, and manage their job search pipeline. The application features an interactive Kanban-style dashboard that provides a clear visual overview of all job applications from initial stage through to offer.

## Features

- **User Authentication**: Secure user registration, password hashing using `bcrypt`, and persistent session management powered by JSON Web Tokens (JWT).
- **Protected Client-Side Routes**: Frontend routes guarded by React Router components to prevent unauthorized access.
- **Interactive Kanban Board**: Dynamic status column tracking (e.g., Applied, Interviewing, Offered, Rejected) to monitor progress visually.
- **Full CRUD Support**: Add, view details, update, and delete application records in real-time.
- **Search & Filter Operations**: Efficiently search job records by company/job title and filter applications by stage or status.
- **Responsive Layout**: Designed with a mobile-first approach using Tailwind CSS to look stunning across desktop, tablet, and mobile browsers.
- **Dark Theme**: Eye-friendly, modern dark mode visual theme built-in.

## Screenshots

Below are the layout representations of the user interface.

* **Dashboard Screenshot**  
  ![Dashboard Screenshot](./screenshots/dashboard.png)

* **Login Screenshot**  
  ![Login Screenshot](./screenshots/login.png)

## Tech Stack

### Frontend
- **React**: Component-driven library for reactive rendering.
- **Vite**: Rapid-build tooling and bundler for fast development feedback loops.
- **Tailwind CSS**: Utility-first styling framework for layout optimization.
- **React Router**: Page routing and authentication guard middleware.
- **Axios**: Promised-based API request handler.

### Backend
- **Node.js**: Asynchronous JavaScript runtime environment.
- **Express.js**: Backend application framework for routing and controller execution.
- **MongoDB**: Schema-flexible NoSQL document database.
- **Mongoose**: Schematics-based Object Data Modeling (ODM) layer for database operations.
- **JWT (JSON Web Tokens)**: Secure token-based session handling.
- **bcrypt**: High-security encryption and hashing library for user passwords.

## Project Structure

```text
Job-Tracker/
├── Backend/
│   ├── config/                  # Database connections and configuration
│   ├── controllers/             # Request handlers for authentication and applications
│   ├── middleware/              # Authentication and validation middleware
│   ├── models/                  # Mongoose schemas (User, Application)
│   ├── Routes/                  # Express route declarations (auth.routes, application.routes)
│   ├── services/                # Database query operations and helper services
│   ├── app.js                   # Express application setup
│   ├── server.js                # Server entry point
│   ├── package.json             # Backend dependencies and run scripts
│   └── .env                     # Local environment configurations (ignored)
├── Frontend/
│   ├── public/                  # Public static assets
│   ├── src/
│   │   ├── components/          # Reusable UI elements (Navbar, Cards, Modals)
│   │   ├── context/             # Global React Context providers (Auth Context)
│   │   ├── pages/               # Main view components (Dashboard, Login, Register)
│   │   ├── services/            # Axios API service endpoints
│   │   ├── App.jsx              # Application router and structure
│   │   ├── index.css            # Tailwind CSS directives
│   │   └── main.jsx             # React client entry point
│   ├── package.json             # Frontend dependencies and dev scripts
│   └── vite.config.js           # Vite configuration
└── README.md                    # Project documentation (this file)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user profile.
- `POST /api/auth/login` - Verify password and return a JSON Web Token.

### Job Applications
- `POST /api/applications` - Create a new application record (Protected).
- `GET /api/applications` - Retrieve all applications associated with the user (Protected).
- `GET /api/applications/:id` - Fetch details for a specific application (Protected).
- `PATCH /api/applications/:id` - Update status or other info for an application (Protected).
- `DELETE /api/applications/:id` - Remove an application record permanently (Protected).

## Installation

### Clone Repository
```bash
git clone <repo-url>
cd Job-Tracker
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Set up the environment parameters in a `.env` file (see [Environment Variables](#environment-variables)).
4. Run the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Configure these settings inside `Backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/jobtracker
JWT_SECRET=your_jwt_secret_key_here
```

## Future Improvements

- **Guest Mode**: Provide a standalone demonstration mode using `localStorage` to allow recruiters to test the application instantly without registering.
- **Analytics Dashboard**: Add charts and data visualization (e.g., using Recharts) to display job application metrics over time.
- **Drag & Drop Kanban**: Enhance the board to support fluid drag-and-drop movement of applications between status columns.
- **Notifications**: Reminders for upcoming interviews or follow-ups.
- **Export Applications**: Export application history as a CSV/Excel file.

## Author

- **Manan** - *Developer*
