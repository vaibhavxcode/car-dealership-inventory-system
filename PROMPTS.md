# AI Prompt History - Car Dealership Inventory System

This file logs the actual prompts I used with AI models while building this project. It tracks my progress from setting up the folders to building backend routes, testing, making the React frontend, and deploying.

---

## Prompt 1 - Project Structure

Prompt:
"Hey, I'm building a car dealership inventory system in React and Node.js. Can you give me a good folder structure for a monorepo setup? I need directories for backend (express, mongoose) and frontend (vite react, tailwind)."

How I Used It:
* Used the suggested layout to create the `/backend` and `/frontend` folders.
* Set up root-level config files to handle dependencies cleanly.

---

## Prompt 2 - User Database Schema

Prompt:
"Help me make a Mongoose User schema. I need fields for name, email, password, and role. Role should be either 'user' or 'admin', defaulting to 'user'. Also, how do I hash passwords with bcrypt in the schema before saving?"

How I Used It:
* Copied the schema code into `backend/models/User.js`.
* Kept the pre-save hook for password hashing and the candidate password comparison helper method.

---

## Prompt 3 - Vehicle Schema Validation

Prompt:
"Now I need a Vehicle schema. Make, model, year, price, quantity, category, description, and imageUrl. Price and quantity can't be negative, so add validation. How do I do that?"

How I Used It:
* Created `backend/models/Vehicle.js`.
* Copied the custom validation messages so the database throws clear errors if quantity or price drops below zero.

---

## Prompt 4 - JWT Middleware Setup

Prompt:
"I need a middleware to protect my routes using JWT. It should check for a Bearer token in the headers, verify it, and put the user info on req.user. Also make a middleware that checks if the user's role is admin."

How I Used It:
* Saved this as `backend/middleware/authMiddleware.js`.
* Applied it globally on routes that need user verification.

---

## Prompt 5 - Auth Endpoints

Prompt:
"Write the auth controllers for registration and login. Just regular sign up and sign in, verify password with bcrypt, and return user info + token. Send 401 if wrong credentials."

How I Used It:
* Added this logic to `backend/controllers/authController.js`.
* Kept the user profile return payload clean by removing the password field before sending it back.

---

## Prompt 6 - Dynamic Search Queries

Prompt:
"My GET /api/vehicles route needs to support filtering. I want to search by query (for make or model, case insensitive), filter by category, or filter by min/max price. How do I build the Mongoose query dynamically?"

How I Used It:
* Refactored the GET controller in `backend/controllers/vehicleController.js`.
* Added logic to only return in-stock cars when a user toggles the "Show In Stock Only" filter.

---

## Prompt 7 - Purchase Logic (Stock Check)

Prompt:
"Write the purchase endpoint logic. It should decrease vehicle quantity by 1. Make sure it doesn't decrease past 0. If it's already 0, return a 400 error. Can we do this atomically to prevent race conditions?"

How I Used It:
* Implemented the route using `findOneAndUpdate` with a query filtering for `quantity: { $gt: 0 }`.
* Set up a clean error message if the car is sold out.

---

## Prompt 8 - Restocking Route

Prompt:
"I need an admin-only restock endpoint. The admin should send a number in the request body, and it should add that to the vehicle's quantity. Make sure they can't send a negative number."

How I Used It:
* Hooked this route up to POST `/api/vehicles/:id/restock` guarded by the admin middleware.
* Used standard integer validation to ensure restock values are positive.

---

## Prompt 9 - Jest Tests Hang Issue

Prompt:
"Okay, I'm using Jest and Supertest to write tests. My test suite works, but when I run npm test, it hangs at the end and says: 'Jest did not exit one second after the test run has completed'. Why is this happening and how do I fix it?"

How I Used It:
* Realized I forgot to close the mongoose connection and disconnect the in-memory database server.
* Fixed it by adding an `afterAll` cleanup block to `backend/tests/vehicle.test.js`.

---

## Prompt 10 - React Auth State Bug

Prompt:
"On the React side, I set up an AuthContext to save user info and JWT in localStorage. But after logging in, if I redirect to the dashboard immediately, my API fetch returns 401. I think the Axios header isn't updating fast enough. How do I fix this?"

How I Used It:
* Refactored the API helper file to read the token directly from `localStorage` using an interceptor on every request.
* Resolved the race condition that occurred when state wasn't updated in time.

---

## Prompt 11 - Frontend Vehicle Card Component

Prompt:
"Can you write a clean React component that displays the vehicles in a grid card layout? Use Tailwind. I want it to look modern and neat with green/red badges for stock, and show a 'Purchase' button if user is logged in, or 'Edit/Restock' if they're admin."

How I Used It:
* Used the code in `frontend/src/components/VehicleCard.jsx`.
* Customized the Tailwind styling to match the website's dark slate color scheme.

---

## Prompt 12 - Deploying Backend to Render

Prompt:
"Deploying my backend to Render. Getting 'Cannot find module server.js' and build fails. In my package.json, the start script is 'node server.js' but server.js is inside /backend. How do I write the build and start commands on Render?"

How I Used It:
* Updated the Render configuration dashboard commands to reference the `/backend` directory correctly.
* Set up the necessary production env variables directly on Render.
