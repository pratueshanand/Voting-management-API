# Voting Management API

A scalable REST API designed to manage voting processes efficiently, built using MongoDB, Node.js, and Express.js.

## Features

- **Scalability:** Engineered for scalability using MongoDB and Node.js to handle large-scale voting operations effectively.
  
- **Authentication:** Implemented JWT token-based authorization for secure end-to-end user authentication.

- **Live Vote Counting:** Real-time vote counting functionality to provide immediate updates on ongoing polls.

- **Poll Voting:** Allows users to participate in polls and cast their votes seamlessly.

- **User Management:** Includes features for user registration, login, and basic CRUD operations essential for managing users and votes.

## Technologies Used

- MongoDB
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- Postman

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up MongoDB database.
4. Configure environment variables, including MongoDB connection URI and JWT secret key.
5. Start the server: `npm start`.

## API Endpoints

- `/signup`: Register a new user.
- `/login`: Authenticate user and generate JWT token.
- `/profile`: User can see Profile.
- `/candidates`: list of candidate.
- `/vote/:candidateId`: View available polls.
- `/vote/count`: View poll results.
- `/users`: Manage users (CRUD operations).

## Usage

### Register a New User

```bash
POST /signup
{
  "aadharCardNumber": "123456789876",
  "password": "example_password"
}
