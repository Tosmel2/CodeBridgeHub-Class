# Student Management System API

A simple Express.js REST API for managing student records.

## Run the API

1. Open a terminal in `Backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /students` - Retrieve all students
- `GET /students/:id` - Retrieve a single student
- `POST /students` - Create a new student
- `PUT /students/:id` - Update an existing student
- `DELETE /students/:id` - Delete a student

## Validation Rules

- `name` is required
- `email` is required and must be valid
- `course` is required
- `level` is required

## Example Request Body

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "course": "Web Development",
  "level": "Intermediate"
}
```

## Example Responses

### GET /students

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "course": "Web Development",
    "level": "Intermediate"
  }
]
```

### POST /students

Status: `201 Created`

```json
{
  "id": 4,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "course": "Web Development",
  "level": "Intermediate"
}
```

### Validation Error

Status: `400 Bad Request`

```json
{
  "errors": [
    {
      "value": "",
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
```

### Not Found

Status: `404 Not Found`

```json
{
  "message": "Student not found"
}
```
