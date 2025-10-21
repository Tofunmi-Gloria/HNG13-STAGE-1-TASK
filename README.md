# String Analyzer Service (Stage 1 - HNG13)

A **Node.js RESTful API** that analyzes strings, stores their properties, and supports retrieval, filtering, and deletion.  

Built for **Stage 1 Backend Task** of HNG13.

---

## Features

- Compute string properties:
  - `length` – number of characters
  - `is_palindrome` – true if string reads the same forwards/backwards
  - `unique_characters` – number of distinct characters
  - `word_count` – number of words
  - `sha256_hash` – unique identifier
  - `character_frequency_map` – count of each character

- Endpoints:
  1. **POST /strings** – Analyze and store a string
  2. **GET /strings/:value** – Retrieve a specific string
  3. **GET /strings** – Retrieve all strings with optional filters
  4. **DELETE /strings/:value** – Delete a string

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- npm (comes with Node.js)

---

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Tofunmi-Gloria/HNG13-STAGE-1-Task.git
````

2. Navigate into the project directory:

```bash
cd <repo-name>
```

3. Install dependencies:

```bash
npm install
```

---

### Running Locally

Start the server:

```bash
node index.js
```

Default server URL: `http://localhost:3000`

---

## API Documentation

### 1. POST /strings

* **Description:** Analyze and store a string.
* **Request Body (JSON):**

```json
{
  "value": "madam"
}
```

* **Success Response (201 Created):**

```json
{
  "id": "<sha256_hash>",
  "value": "madam",
  "properties": {
    "length": 5,
    "is_palindrome": true,
    "unique_characters": 3,
    "word_count": 1,
    "sha256_hash": "<sha256_hash>",
    "character_frequency_map": { "m": 2, "a": 2, "d": 1 }
  },
  "created_at": "2025-10-21T12:25:36.442Z"
}
```

* **Error Responses:**

  * `409 Conflict` – String already exists
  * `422 Unprocessable Entity` – Value must be a string
  * `400 Bad Request` – Missing `value` field or invalid request body

---

### 2. GET /strings/:value

* **Description:** Retrieve a string by exact value.
* **Success Response (200 OK):**

```json
{
  "id": "<sha256_hash>",
  "value": "madam",
  "properties": { /* same as POST */ },
  "created_at": "2025-10-21T12:25:36.442Z"
}
```

* **Error Response (404 Not Found):**

```json
{"error": "String not found"}
```

---

### 3. GET /strings

* **Description:** Retrieve all strings, supports filters via query parameters:

  * `is_palindrome` (true/false)
  * `min_length` / `max_length` (number)
  * `word_count` (number)
  * `contains_character` (single character)

* **Example Requests:**

```
GET /strings
GET /strings?is_palindrome=true
GET /strings?min_length=5&max_length=10
GET /strings?word_count=2
GET /strings?contains_character=a
GET /strings?is_palindrome=true&min_length=5&contains_character=a
```

* **Success Response (200 OK):**

```json
{
  "data": [ /* array of matching strings */ ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": "true",
    "min_length": "5"
  }
}
```

* **Error Responses:**

  * `400 Bad Request` – Invalid query parameter values or types

---

### 4. DELETE /strings/:value

* **Description:** Delete a string from the database.
* **Success Response (204 No Content)** – empty body
* **Error Response (404 Not Found):**

```json
{"error": "String not found"}
```

---

### 5. GET / (root route)

* **Description:** Simple message to check server is running
* **Success Response (200 OK):**

```
Welcome! The backend is running. Use POST /strings to analyze a string.
```

---

## Testing

* Use [Postman](https://www.postman.com/) or similar API tool.
* POST requests must use **raw JSON** in the request body.
* Test all filters (`is_palindrome`, `min_length`, `max_length`, `word_count`, `contains_character`) individually and in combination.
* Test edge cases:

  * Empty string `""`
  * Strings with only spaces `"   "`
  * Strings with special characters `"A man, a plan, a canal: Panama"`

---

## Deployment

* Allowed platforms: **Railway, Heroku, AWS, PXXL App**
* Ensure deployed URL works for all endpoints (`POST`, `GET`, `DELETE`)
* Copy base URL for submission.

---

## Author

* **Name:** `<Jesutofunmi Afolabi>`
* **Email:** `<jesutofunmiafolabi73@gmail.com>`

```

---
