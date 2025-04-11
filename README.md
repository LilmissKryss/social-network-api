# Social Network API

## Description
This is a backend API for a social network web application. It allows users to share their thoughts, react to friends' thoughts, and manage their friend lists. The API is built using Node.js, Express.js, MongoDB, and Mongoose ODM.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Models](#models)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication with JWT
- Create, read, update, and delete users
- Add and remove friends
- Create, read, update, and delete thoughts
- Add and remove reactions to thoughts
- Formatted timestamps
- Email validation
- Friend count virtual
- Reaction count virtual

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JSON Web Token (JWT)
- bcrypt

## Installation
1. Clone the repository: <br>
   git clone <br>
   https://github.com/LilmissKryss/social-network-api

2. Install dependencies: <br>
   cd social-network-api <br>
   npm install

3. Create a .env file in the root directory and add  environment variables:

   JWT_SECRET=your_jwt_secret_here
   MONGODB_URI=mongodb://localhost:27017/socialDB
   
4. Start the server:<br>
   npm start

## Usage
The API can be tested using Insomnia or any other API testing tool. Make sure to:
1. Register a user first to get a JWT token
2. Include the JWT token in the Authorization header for protected routes
3. Use the correct Content-Type header (application/json) for requests with a body

## API Routes

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Friends
- `POST /api/users/:userId/friends/:friendId` - Add friend
- `DELETE /api/users/:userId/friends/:friendId` - Remove friend

### Thoughts
- `GET /api/thoughts` - Get all thoughts
- `GET /api/thoughts/:id` - Get single thought by ID
- `POST /api/thoughts` - Create new thought
- `PUT /api/thoughts/:id` - Update thought
- `DELETE /api/thoughts/:id` - Delete thought

### Reactions
- `POST /api/thoughts/:thoughtId/reactions` - Add reaction
- `DELETE /api/thoughts/:thoughtId/reactions/:reactionId` - Remove reaction

## Models

### User
- `username`: String (Required, Unique, Trimmed)
- `email`: String (Required, Unique, Valid email format)
- `password`: String (Required, Min length 6)
- `thoughts`: Array of Thought references
- `friends`: Array of User references
- Virtual: `friendCount`

### Thought
- `thoughtText`: String (Required, 1-280 characters)
- `createdAt`: Date (Default: Current timestamp)
- `username`: String (Required)
- `reactions`: Array of Reaction subdocuments
- Virtual: `reactionCount`

### Reaction (Schema)
- `reactionId`: ObjectId
- `reactionBody`: String (Required, Max 280 characters)
- `username`: String (Required)
- `createdAt`: Date (Default: Current timestamp)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License. 