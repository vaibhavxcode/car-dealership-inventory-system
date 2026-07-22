# DriveElite | Car Dealership Inventory System

A complete, full-stack Car Dealership Inventory System built with the MERN stack (MongoDB, Express, React, Node.js) that satisfies all authentication, authorization, vehicle search, and inventory restocking business logic.

---

## Project Overview

DriveElite is a premium dealership inventory workspace designed to streamline vehicle procurement and catalog management. The application splits functionalities between standard users (who browse catalogs and purchase available cars) and administrative accounts (who manage vehicle details, restock vehicles, and delete entries).

## Features

* **JWT Authentication:** Secure cookie/bearer token login, register, and logout.
* **Role-Based Access Control:** Differentiates interfaces and access rights between `user` and `admin` roles.
* **Smart Search & Filtering:** Filter the vehicle fleet dynamically by manufacturer (make), category (Sedan, SUV, Hatchback, Truck), and custom price limits.
* **Inventory Control & Business Rules:**
  * **Purchase:** Standard users can purchase cars, reducing inventory stock by 1. The button is disabled and marked "Out of Stock" if stock hits 0.
  * **Restock:** Administrators can restock units by adding any positive integer to the inventory count. Negative values are prevented.
* **Comprehensive Test Coverage:** Integration tests for authentication endpoints and inventory business rules written with Jest and Supertest.
* **Centralized Error Handling:** Formatted JSON responses covering Validation errors, cast errors, duplicate values, and unauthorized access.

## Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Lucide Icons
* **Backend:** Node.js, Express.js, MongoDB with Mongoose, JWT, bcryptjs
* **Testing:** Jest + Supertest with `mongodb-memory-server`

---

## Installation & Directory Structure

```text
/
├── backend/            # Express REST API, Mongoose Models, Jest Tests
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── tests/
│   │   └── app.js
│   ├── server.js
│   └── package.json
├── frontend/           # React SPA, Vite, Tailwind CSS
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   ├── layouts/
│   │   └── App.jsx
│   └── package.json
└── package.json        # Workspace orchestration scripts
```

### Environment Variables

Create a `.env` file in the `/backend` folder with the following properties:

```env
PORT=5090
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

---

## Setup Instructions

### 1. Install Dependencies
From the root directory, run:
```bash
npm run install:all
```

### 2. Seed the Database
Make sure you have MongoDB running locally, then execute:
```bash
npm run seed:backend
```
*Creates default accounts:*
* **Admin:** `admin@dealership.com` / `adminpassword123`
* **User:** `john@example.com` / `userpassword123`

### 3. Run Backend
```bash
npm run start:backend
```
Runs the server on [http://localhost:5090](http://localhost:5090)

### 4. Run Frontend
```bash
npm run start:frontend
```
Runs the React app on [http://localhost:3000](http://localhost:3000)

---

## Running Tests

To run the automated Jest integration tests:
```bash
npm run test:backend
```
*Note: Tests run against an isolated in-memory MongoDB database server (`mongodb-memory-server`), ensuring local database collections remain untouched.*

---

## API Endpoints List

### Authentication
* `POST /api/auth/register` - Create standard user account
* `POST /api/auth/login` - Verify credentials and return token
* `POST /api/auth/logout` - Clear user session

### Vehicles & Inventory
* `GET /api/vehicles` - List all vehicles (Protected)
* `GET /api/vehicles/search` - Query list by `make`, `model`, `category`, `minPrice`, `maxPrice` (Protected)
* `POST /api/vehicles` - Add new vehicle (Protected, Admin only)
* `PUT /api/vehicles/:id` - Update vehicle information (Protected, Admin only)
* `DELETE /api/vehicles/:id` - Delete vehicle record (Protected, Admin only)
* `POST /api/vehicles/:id/purchase` - Purchase 1 unit from stock (Protected)
* `POST /api/vehicles/:id/restock` - Increase stock level (Protected, Admin only)

---

## Screenshots Section
*(Placeholders for future application screenshots)*
* *Login View*
* *User Catalog Board*
* *Admin Inventory Panel*

---

## Deployment Instructions

1. **Production Build:** Build the static asset bundle in the frontend directory:
   ```bash
   cd frontend && npm run build
   ```
2. **Serve Assets:** Configure the Express backend to serve static assets from the `frontend/dist` directory:
   ```javascript
   app.use(express.static(path.join(__dirname, '../../frontend/dist')));
   ```
3. **Database Hosting:** Set up a production database instance on MongoDB Atlas and update `MONGODB_URI` environment variable.
4. **Environment Hosting:** Deploy the backend on cloud services (e.g., Render, Heroku, AWS Elastic Beanstalk) ensuring environmental secrets are configured in the cloud settings dashboard.

---

## My AI Usage

### AI Tools Used
* Google Gemini (Antigravity Agent)

### How they were Used
* Created the backend architecture, Express configuration, Mongoose schemas, and routes.
* Developed the in-memory testing strategy with Jest, Supertest, and `mongodb-memory-server`.
* Styled the React UI components with responsive cards, glassmorphic navigations, search fields, and admin management actions.

### Reflection
* **Strengths:** Generating template code and designing complex Tailwind designs was extremely efficient. Organizing backend routing structures using standard patterns saved substantial development time.
* **Limitations:** Context coordination when dealing with file updates over separate terminal environments require careful sequencing to ensure the tests run sequentially and standard mock data is cleanly cleaned up.
