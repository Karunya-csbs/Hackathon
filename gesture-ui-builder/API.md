# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     http://localhost:5000/api/projects
```

---

## Response Format

All responses are JSON:

### Success Response
```json
{
  "data": {...},
  "message": "Success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

---

## Endpoints

## Authentication

### 1. Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "user_12345",
  "email": "user@example.com"
}
```

**Errors**:
- `400` - Email or password missing
- `409` - User already exists

---

### 2. Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "user_12345",
  "email": "user@example.com"
}
```

**Errors**:
- `400` - Email or password missing
- `401` - Invalid credentials

---

## Projects (Protected)

### 3. Get All Projects

```http
GET /projects
Authorization: Bearer <TOKEN>
```

**Response** (200 OK):
```json
[
  {
    "id": "proj_abc123",
    "userId": "user_12345",
    "projectName": "My Button",
    "layoutJson": [
      { "type": "Button", "props": { "text": "Click Me" } }
    ],
    "reactCode": "import React from 'react'...",
    "createdAt": "2024-03-05T10:30:00Z"
  },
  {
    "id": "proj_def456",
    "userId": "user_12345",
    "projectName": "Landing Page",
    "layoutJson": [
      { "type": "Navbar" },
      { "type": "Card" }
    ],
    "reactCode": "import React from 'react'...",
    "createdAt": "2024-03-04T15:22:00Z"
  }
]
```

**Errors**:
- `401` - No token provided
- `401` - Invalid token

---

### 4. Create Project

```http
POST /projects
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "projectName": "My App",
  "layoutJson": [
    { "type": "Button" },
    { "type": "Card" }
  ],
  "reactCode": "import React from 'react';\nfunction App() { return (...) }"
}
```

**Response** (201 Created):
```json
{
  "id": "proj_xyz789",
  "userId": "user_12345",
  "projectName": "My App",
  "layoutJson": [...],
  "reactCode": "...",
  "createdAt": "2024-03-05T10:30:00Z"
}
```

**Errors**:
- `400` - Project name required
- `401` - Not authenticated

---

### 5. Get Project by ID

```http
GET /projects/:id
Authorization: Bearer <TOKEN>
```

**Example:**
```http
GET /projects/proj_abc123
Authorization: Bearer <TOKEN>
```

**Response** (200 OK):
```json
{
  "id": "proj_abc123",
  "userId": "user_12345",
  "projectName": "My Button",
  "layoutJson": [...],
  "reactCode": "...",
  "createdAt": "2024-03-05T10:30:00Z"
}
```

**Errors**:
- `403` - Not authorized to access this project
- `404` - Project not found (implicit in error response)

---

### 6. Update Project

```http
PUT /projects/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "projectName": "Updated Name",
  "layoutJson": [...],
  "reactCode": "..."
}
```

**Example:**
```http
PUT /projects/proj_abc123
Authorization: Bearer <TOKEN>

{
  "projectName": "My Amazing Button"
}
```

**Response** (200 OK):
```json
{
  "id": "proj_abc123",
  "userId": "user_12345",
  "projectName": "My Amazing Button",
  "layoutJson": [...],
  "reactCode": "...",
  "createdAt": "2024-03-05T10:30:00Z"
}
```

**Errors**:
- `403` - Not authorized
- `404` - Project not found

---

### 7. Delete Project

```http
DELETE /projects/:id
Authorization: Bearer <TOKEN>
```

**Example:**
```http
DELETE /projects/proj_abc123
Authorization: Bearer <TOKEN>
```

**Response** (200 OK):
```json
{
  "message": "Project deleted"
}
```

**Errors**:
- `403` - Not authorized
- `404` - Project not found

---

## Deployment (Protected)

### 8. Deploy Project to Netlify

```http
POST /deploy
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "projectId": "proj_abc123"
}
```

**Response** (200 OK):
```json
{
  "message": "Deployment successful",
  "url": "https://gesture-ui-abc12345.netlify.app",
  "deployment": {
    "id": "dep_123",
    "projectId": "proj_abc123",
    "netlifyUrl": "https://gesture-ui-abc12345.netlify.app",
    "deployStatus": "success",
    "deployedAt": "2024-03-05T10:30:00Z"
  }
}
```

**Errors**:
- `400` - Project ID required
- `403` - Not authorized
- `500` - Deployment failed

---

### 9. Get Deployment History

```http
GET /deploy/:projectId
Authorization: Bearer <TOKEN>
```

**Example:**
```http
GET /deploy/proj_abc123
Authorization: Bearer <TOKEN>
```

**Response** (200 OK):
```json
[
  {
    "id": "dep_456",
    "projectId": "proj_abc123",
    "netlifyUrl": "https://gesture-ui-xyz.netlify.app",
    "deployStatus": "success",
    "deployedAt": "2024-03-05T10:30:00Z"
  },
  {
    "id": "dep_123",
    "projectId": "proj_abc123",
    "netlifyUrl": "https://gesture-ui-abc.netlify.app",
    "deployStatus": "success",
    "deployedAt": "2024-03-04T15:22:00Z"
  }
]
```

**Errors**:
- `403` - Not authorized
- `404` - Project not found

---

## Website Import

### 10. Import Website Components

```http
POST /import
Content-Type: application/json

{
  "url": "https://example.com"
}
```

**Response** (200 OK):
```json
{
  "components": [
    {
      "type": "Navbar",
      "description": "Navigation bar detected"
    },
    {
      "type": "Button",
      "description": "5 buttons detected",
      "count": 5
    },
    {
      "type": "Card",
      "description": "8 card-like components detected",
      "count": 8
    },
    {
      "type": "Form",
      "description": "2 forms detected",
      "count": 2
    },
    {
      "type": "Input",
      "description": "12 input fields detected",
      "count": 12
    },
    {
      "type": "Image",
      "description": "15 images detected",
      "count": 15
    }
  ]
}
```

**Errors**:
- `400` - URL required or invalid
- `500` - Failed to fetch or parse website

---

## Health Check

### 11. Health Check

```http
GET /health
```

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2024-03-05T10:30:00Z"
}
```

---

## HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Not authorized for resource |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Server error |

---

## Error Examples

### Missing Token
```bash
curl http://localhost:5000/api/projects

# Response:
{
  "error": "No token provided",
  "status": 401
}
```

### Invalid Token
```bash
curl -H "Authorization: Bearer invalid_token" \
     http://localhost:5000/api/projects

# Response:
{
  "error": "Invalid token",
  "status": 401
}
```

### Project Not Found
```bash
curl -H "Authorization: Bearer <TOKEN>" \
     http://localhost:5000/api/projects/nonexistent

# Response:
{
  "error": "Not authorized",
  "status": 403
}
```

### Invalid URL Format
```bash
curl -X POST http://localhost:5000/api/import \
     -H "Content-Type: application/json" \
     -d '{"url": "not-a-url"}'

# Response:
{
  "error": "Failed to import website",
  "status": 500
}
```

---

## Example Workflows

### 1. User Registration & Project Creation

```bash
# Step 1: Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "user_12345",
  "email": "user@example.com"
}

# Step 2: Create Project
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "My First App",
    "layoutJson": [{"type": "Button"}],
    "reactCode": "function App() { return <button>Click</button> }"
  }'

# Response:
{
  "id": "proj_abc123",
  "userId": "user_12345",
  "projectName": "My First App",
  ...
}
```

### 2. Import Website & Deploy

```bash
# Step 1: Import components
curl -X POST http://localhost:5000/api/import \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Response:
{
  "components": [
    {"type": "Navbar"},
    {"type": "Button"},
    ...
  ]
}

# Step 2: Deploy project
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:5000/api/deploy \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"projectId": "proj_abc123"}'

# Response:
{
  "message": "Deployment successful",
  "url": "https://gesture-ui-abc12345.netlify.app"
}
```

---

## Rate Limiting (Future)

Currently no rate limiting in place. Future versions will implement:

```
- 100 requests per minute per IP
- 1000 requests per day per user
- Deployment rate: 10 deployments per hour
```

---

## Webhooks (Future)

Planned webhook events:
- `deployment.success`
- `deployment.failed`
- `project.created`
- `project.deleted`

---

## Pagination (Future)

Future support for large result sets:

```http
GET /projects?page=1&limit=20
GET /projects?offset=0&limit=20
```

---

## API Client Example (JavaScript)

```javascript
const API_URL = 'http://localhost:5000/api';

class API {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Projects
  async getProjects() {
    return this.request('/projects');
  }

  async createProject(projectName, layoutJson, reactCode) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify({ projectName, layoutJson, reactCode })
    });
  }

  async deleteProject(projectId) {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE'
    });
  }

  // Deploy
  async deployProject(projectId) {
    return this.request('/deploy', {
      method: 'POST',
      body: JSON.stringify({ projectId })
    });
  }

  // Import
  async importWebsite(url) {
    return this.request('/import', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  }
}

// Usage
const api = new API();

// Login
const { token } = await api.login('user@example.com', 'password');
localStorage.setItem('authToken', token);
api.token = token;

// Get projects
const projects = await api.getProjects();

// Create project
const project = await api.createProject(
  'My App',
  [{type: 'Button'}],
  'function App() { ... }'
);

// Deploy
const { url } = await api.deployProject(project.id);
console.log('Live at:', url);
```

---

## API Client Example (cURL)

```bash
#!/bin/bash

API="http://localhost:5000/api"

# Login
RESPONSE=$(curl -s -X POST $API/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')
echo "Token: $TOKEN"

# Get projects
curl -s -H "Authorization: Bearer $TOKEN" \
  $API/projects | jq '.'

# Create project
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "My App",
    "layoutJson": [{"type":"Button"}],
    "reactCode": "function App() { return <button>Click</button> }"
  }' \
  $API/projects | jq '.'

# Deploy
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"projectId": "proj_abc123"}' \
  $API/deploy | jq '.'
```

---

For more information, see:
- [README.md](README.md) - Platform overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation steps
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
