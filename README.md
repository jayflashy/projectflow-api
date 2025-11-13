# ProjectFlow API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  A robust and scalable REST API for project and task management, built with NestJS, Prisma, and PostgreSQL.
</p>
<br>

## ✨ Features

-   **JWT Authentication**: Secure user registration and login using JSON Web Tokens (access and refresh tokens).
-   **Role-Based Access Control (RBAC)**: Differentiated permissions for `ADMIN`, `MANAGER`, and `USER` roles.
-   **User Management**: Admin-only endpoints for creating, viewing, updating, and deleting users.
-   **Project & Category Management**: Full CRUD operations for organizing tasks into projects and categories.
-   **Task Management**: Comprehensive CRUD functionality for tasks, including assignment, status updates, and due dates.
-   **Advanced Querying**: Paginated, filterable, and sortable API responses for tasks and users.
-   **Validation & Serialization**: Automatic request validation and response serialization to ensure data integrity and security.
-   **API Documentation**: Auto-generated, interactive API documentation with Swagger (OpenAPI).

## 🛠️ Tech Stack

-   **Framework**: [NestJS](https://nestjs.com/)
-   **Database ORM**: [Prisma](https://www.prisma.io/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **Authentication**: [Passport.js](http://www.passportjs.org/) with JWT Strategy
-   **Validation**: [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)
-   **API Documentation**: [Swagger](https://swagger.io/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
-   [pnpm](https://pnpm.io/) (or npm/yarn)
-   [PostgreSQL](https://www.postgresql.org/download/) database running locally or on a cloud service.
-   [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/jayflashy/projectflow-api.git
cd projectflow
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in your database connection string and a secure JWT secret:

```
# .env
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/projectflow_db"
JWT_SECRET="your-super-secret-and-long-jwt-key"
PORT=7090
```

### 4. Run Database Migrations

Apply the database schema to your PostgreSQL database:

```bash
npx prisma migrate deploy
```

_Note: If you are in a development environment and need to make schema changes, use `npx prisma migrate dev`._

### 5. Run the Application

```bash
# Development mode with hot-reloading
pnpm run start:dev
```

The application will be running on `http://localhost:7090`.

---

## 📖 API Documentation

Once the application is running, you can access the interactive Swagger API documentation at:

**`http://localhost:7090/api/docs`**

This documentation provides a complete list of available endpoints, their required parameters, and allows you to test them directly from your browser.

## ⚙️ Available Scripts

-   `pnpm run start`: Start the application.
-   `pnpm run start:dev`: Start the application in watch mode.
-   `pnpm run start:prod`: Start the application in production mode (after building).
-   `pnpm run build`: Build the application for production.
-   `pnpm run lint`: Lint the codebase.
-   `pnpm run format`: Format the codebase with Prettier.
-   `pnpm run test`: Run unit tests.
-   `pnpm run test:e2e`: Run end-to-end tests.
-   `pnpm run test:cov`: Run tests with coverage report.

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.