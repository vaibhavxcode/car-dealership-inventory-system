# AI Prompts Used

This file documents the prompts used during the development of the Car Dealership Inventory System.

## 1. Initial Architecture & Database Design

* **Prompt:**
  > "Design a User and Vehicle schema for a car dealership inventory system. The User schema should have name, email, password, and role (default 'user', enum: ['user', 'admin']). The Vehicle schema should have make, model, category, price, and quantity, with constraints to keep price and quantity greater than or equal to 0."

## 2. API Endpoints Implementation

* **Prompt:**
  > "Write Express routes and controller logic for the following endpoints: User registration and login with JWT and bcrypt; Vehicle CRUD (admin only for create, update, delete); Search vehicles by make, model, category, and price bounds; Purchase vehicle (decrementing quantity by 1, rejecting if 0); Restock vehicle (increasing quantity by specified amount, preventing negative numbers)."

## 3. Automated Testing Suite

* **Prompt:**
  > "Create Jest and Supertest integration tests for the authentication and vehicle endpoints. The tests must run against an in-memory MongoDB database and verify registration successes/failures, logins, vehicle actions under admin/user credentials, inventory purchases, and restocking business logic."

## 4. Frontend Application & Styling

* **Prompt:**
  > "Build a modern, glassmorphic React dashboard using Tailwind CSS and Lucide React. Set up an authentication context with localStorage persistence, dynamic nav bars showing contextual links based on roles, search/filters on the main catalog, and an administrative control panel to manage inventory details and trigger restock actions."
