# Dashboard Application Documentation

## Project Overview

This is a React-based dashboard application that provides user authentication, data visualization, and user management features. The application consumes data from the RESTful API provided by [reqres.in](https://reqres.in).

## Technology Stack

- **Frontend Framework**: React.js
- **Build Tool**: Vite
- **Routing**: React Router Dom
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: React Icons

## Project Structure

```
src/
├── assets/           # Static assets like images
├── components/       # Reusable UI components
│   ├── login.jsx     # User login form
│   ├── navbar.jsx    # Top navigation bar
│   ├── protectedRoute.jsx # Route protection component
│   ├── regis.jsx     # User registration form
│   ├── search.jsx    # Search component
│   └── sidebar.jsx   # Sidebar navigation
├── page/             # Main application pages
│   ├── dashboard/    # Dashboard related pages
│   │   ├── [id]/     # Dynamic route for user details
│   │   │   └── detail.jsx # User detail page
│   │   ├── dashboard.jsx # Main dashboard page
│   │   └── layout.jsx # Layout for dashboard
│   ├── front/        # Authentication related pages
│   │   └── front.jsx # Landing page with login/register
│   └── homePage/     # Home page
├── App.css           # App-level styles
├── App.jsx           # Main app component with routing
├── index.css         # Global styles
└── main.jsx          # Application entry point
```

## Features

### Authentication

The application implements a login/register system using JWT tokens. User credentials are validated against the reqres.in API.

Key authentication features:
- User login with email and password
- User registration
- Protected routes using token-based authentication
- JWT token storage in localStorage
- Automatic redirection to login page for unauthenticated users

### Dashboard Interface

The dashboard consists of several key UI components:

1. **Sidebar Navigation**
   - User profile information
   - Navigation links to different sections
   - Logout functionality

2. **Navbar**
   - Breadcrumb navigation showing current location
   - Search functionality
   - Notification icons

3. **Main Dashboard**
   - User data list with pagination
   - User cards displaying profile images and basic information
   - Navigation to detailed user views

### User Management

The application allows viewing and managing user data:

1. **User List**
   - Display of users in card format
   - Pagination controls
   - Quick access to user details

2. **User Details**
   - Detailed view of individual user information
   - Display of profile image, name, email, and other user data
   - Form-like interface for viewing user details

## API Integration

The application integrates with the reqres.in API for:

- User authentication (login/register)
- Fetching user data
- Pagination of user lists
- Retrieving individual user details

## Key Components

### App.jsx

The main application component that defines the routing structure using React Router:
- Public route for the front page
- Protected routes for the dashboard and user details
- Nested routing for dashboard layout

### ProtectedRoute.jsx

A component that checks for authentication token and redirects unauthorized users to the login page.

### Layout.jsx

Defines the layout structure for the dashboard, consisting of:
- Sidebar navigation
- Main content area with navbar and content outlet

### Dashboard.jsx

Displays a list of users from the API with:
- User card components
- Pagination controls
- API data fetching logic

### Detail.jsx

Displays detailed information about a specific user:
- User image
- Personal information in form fields
- Dynamic data fetching based on URL parameters

### Sidebar.jsx

Navigation component with:
- User profile section
- Menu categories and items
- Logout functionality

### Login.jsx and Regis.jsx

Authentication forms with:
- Form validation
- API integration
- Error handling
- Success notifications

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Usage

1. Open the application in your browser
2. Login with credentials from reqres.in:
   - Email: eve.holt@reqres.in
   - Password: cityslicka

3. Navigate through the dashboard using the sidebar menu
4. View user details by clicking on user cards
5. Log out using the logout button in the sidebar

## Authentication Notes

This application uses token-based authentication with the reqres.in API:

- Tokens are stored in localStorage
- Protected routes check for token existence
- Unauthorized access redirects to the login page
- Logging out removes the token from storage

## API Endpoints Used

- POST `/api/login` - User authentication
- GET `/api/users?page={page}` - Fetch paginated user list
- GET `/api/users/{id}` - Fetch individual user details 