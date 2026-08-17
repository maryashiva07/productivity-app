# productivity-app

# 🚀 PRODUCTIVITY

A full-stack productivity and Todo management application built to help users organize, manage, and track their daily tasks.

The application includes secure JWT authentication, user-specific Todo management, Redis caching for faster data access, MySQL database integration using Sequelize, and Docker containerization.

---

## 🌟 Features

* 🔐 User Signup & Login
* 🔑 JWT-based Authentication
* 👤 User-specific Todo Management
* ➕ Create Todos
* 📋 View Todos
* ✏️ Edit Todos
* 🗑️ Delete Todos
* 🔎 Filter Todos by Status and Priority
* ⚡ Redis Caching
* 🗄️ MySQL Database
* 🔄 Sequelize ORM
* 🐳 Docker Containerization
* 📱 Responsive UI
* 🚪 Logout functionality

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* LocalStorage

### Backend

* Node.js
* Express.js
* JWT
* bcryptjs

### Database

* MySQL
* Sequelize ORM

### Caching

* Redis

### DevOps

* Docker
* Docker Compose

---

## 🏗️ Project Architecture

```text
                    PRODUCTIVITY
                         │
                         ▼
                    Frontend UI
                  HTML / CSS / JS
                         │
                    Fetch API
                         │
                         ▼
                  Node.js + Express
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
       JWT Authentication       Todo APIs
             │                       │
             ▼                       ▼
           MySQL                  Redis
        + Sequelize              Caching
```

---

## 📂 Project Structure

```text
PRODUCTIVITY/
│
├── config/
│   ├── database.js
│   └── redis.js
│
├── controllers/
│   ├── authController.js
│   └── todoController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── modules/
│   ├── User.js
│   └── Todo.js
│
├── routes/
│   ├── authRoutes.js
│   └── todoRoutes.js
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── script.js
│   ├── auth.js
│   └── style.css
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔐 Authentication

PRODUCTIVITY uses JWT-based authentication.

After successful login:

```text
User Login
    ↓
Validate Email & Password
    ↓
bcrypt Password Verification
    ↓
Generate JWT
    ↓
Store Token in LocalStorage
    ↓
Access Protected Todo APIs
```

The JWT contains the authenticated user's ID and email.

Todo operations use the authenticated user's ID to ensure users can only access their own Todos.

---

## ⚡ Redis Caching

Redis is used to improve Todo API performance.

The application checks Redis before querying MySQL:

```text
Request
   ↓
Check Redis
   │
   ├── Cache HIT ──→ Return cached data
   │
   └── Cache MISS
           ↓
        MySQL
           ↓
      Store in Redis
           ↓
      Return data
```

Todo cache entries expire automatically after a short period.

Caches are also cleared when Todos are created, updated, or deleted.

---

## 🗄️ Database

The application uses **MySQL** with **Sequelize ORM**.

### User

```text
id
name
email
password
```

### Todo

```text
id
title
description
priority
status
userId
createdAt
updatedAt
```

Each Todo is associated with the user who created it through `userId`.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | `/api/auth/signup` | Create a new account |
| POST   | `/api/auth/login`  | Login user           |

### Todos

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| GET    | `/api/todos`     | Get logged-in user's Todos |
| GET    | `/api/todos/:id` | Get a specific Todo        |
| POST   | `/api/todos`     | Create a Todo              |
| PUT    | `/api/todos/:id` | Update a Todo              |
| DELETE | `/api/todos/:id` | Delete a Todo              |

Optional filters:

```text
GET /api/todos?status=pending
GET /api/todos?priority=high
```

---

## 🐳 Run with Docker

Make sure Docker Desktop is installed and running.

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd productivity-app
```

Create a `.env` file:

```env
DB_NAME=todo
DB_USER=todo_user
DB_PASSWORD=your_password
DB_HOST=mysql
DB_DIALECT=mysql
DB_PORT=3306

REDIS_URL=redis://redis:6379

JWT_SECRET=your_jwt_secret

PORT=6555
```

Build and start the containers:

```bash
docker compose up --build
```

The application will be available at:

```text
http://localhost:6555
```

To stop the containers:

```bash
docker compose down
```

---

## 💻 Run Without Docker

Install dependencies:

```bash
npm install
```

Configure your `.env` file and make sure MySQL and Redis are running.

Start the application:

```bash
npm start
```

For development:

```bash
npm run dev
```

---

## 🔒 Environment Variables

Do not commit your `.env` file to GitHub.

Required environment variables:

```env
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_DIALECT=
DB_PORT=

REDIS_URL=

JWT_SECRET=

PORT=
```

---

## 📸 Screenshots

### Login

*Add your login page screenshot here.*

### Dashboard

*Add your Todo dashboard screenshot here.*

### Todo Management

*Add your Todo management screenshot here.*

---

## 🚀 Deployment

The application is containerized using Docker and is ready for production deployment.

Planned deployment architecture:

```text
GitHub
   ↓
Docker Build
   ↓
Cloud Hosting
   │
   ├── Node.js / Express
   ├── MySQL
   └── Redis
```

---

## 🔮 Future Improvements

* 🔵 Google OAuth Login
* 📧 Email verification
* 🔄 Password reset
* 📅 Due dates and reminders
* 📊 Productivity analytics
* 🔔 Notifications
* 🎯 Todo categories
* 🌙 Dark mode
* 📱 Progressive Web App (PWA)

---

## 👨‍💻 Author

**Shiva Marya**

Full-Stack Developer | Node.js | Express | MySQL | Redis | Docker

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
