# Task Board Backend

Backend API for a Task Board application.

The application allows users to create boards and manage cards inside them. Cards can be created, updated, deleted, moved between statuses, and reordered within a status.

The backend is built with Node.js, Express, TypeScript, and MongoDB using Mongoose.

---

## Features

### Boards

- Create a board
- Get a board by its public ID
- Update a board
- Delete a board
- Automatically delete cards when a board is deleted
- Generate a public ID for sharing/opening a board

### Cards

- Create cards
- Update cards
- Delete cards
- Move cards between statuses
- Reorder cards within a status
- Automatically assign a position to new cards
- Retrieve cards grouped by status

### Validation

- Request body validation with Joi
- Validation for required fields
- Validation for string length
- Validation for card status
- Protection against unknown request fields

### Error Handling

- Centralized error handling
- Standardized error responses
- Resource-not-found errors
- Invalid MongoDB ID handling
- MongoDB validation errors
- Duplicate resource handling
- Generic internal server errors
- Custom 404 handling for unknown routes

### Testing

- Unit tests with Vitest
- Service layer tests
- Repository calls mocked during unit tests
- Tests for board and card business logic
- Tests for card positioning
- Tests for error cases

---

# Tech Stack

## Backend

- Node.js
- Express
- TypeScript

## Database

- MongoDB
- Mongoose

## Validation

- Joi

## Testing

- Vitest

## Development Tools

- Nodemon
- ESLint
- Prettier
- ts-node
- TypeScript

---

# Project Structure

```text
Task-Board-BE/
│
├── src/
│   │
│   ├── controllers/
│   │   ├── board.controller.ts
│   │   └── card.controller.ts
│   │
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   ├── not-found.middleware.ts
│   │   └── validate.ts
│   │
│   ├── models/
│   │   ├── board.model.ts
│   │   └── card.model.ts
│   │
│   ├── repositories/
│   │   ├── base.repository.ts
│   │   ├── board.repository.ts
│   │   ├── card.repository.ts
│   │   └── index.repository.ts
│   │
│   ├── routes/
│   │   ├── index.ts
│   │   ├── board_route.ts
│   │   └── card_route.ts
│   │
│   ├── services/
│   │   ├── board.service.ts
│   │   └── card.service.ts
│   │
│   ├── validation/
│   │   ├── board.validation.ts
│   │   └── card.validation.ts
│   │
│   ├── interfaces/
│   │   ├── board.interface.ts
│   │   └── card.interface.ts
│   │
│   ├── utils/
│   │   ├── enum.ts
│   │   ├── types.ts
│   │   └── validation.ts
│   │
│   └── server.ts
│
├── tests/
│   └── services/
│       ├── board.service.test.ts
│       └── card.service.test.ts
│
├── .env
├── .gitignore
├── nodemon.json
├── package.json
├── tsconfig.json
└── README.md