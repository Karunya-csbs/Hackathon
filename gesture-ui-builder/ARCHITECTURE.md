# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  React Frontend (Port 3000)                │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │   Layout     │  │  Page        │  │  Code Panel  │  │ │
│  │  │   Manager    │  │  Builder     │  │              │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │    Gesture Detection (MediaPipe)                    │ │ │
│  │  │    - Hand Tracking                                  │ │ │
│  │  │    - Gesture Classification                         │ │ │
│  │  │    - Real-time Rendering                           │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │    State Management                                 │ │ │
│  │  │    - Layout State                                   │ │ │
│  │  │    - Gesture State                                  │ │ │
│  │  │    - Code State                                     │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             ↓↑                                   │
│                      HTTP / REST API                             │
│                      (Axios)                                     │
└─────────────────────────────────────────────────────────────────┘
                             ↓↑
           ┌──────────────────────────────────────┐
           │                                      │
           ↓                                      ↓
    ┌──────────────┐                    ┌──────────────┐
    │  Netlify     │                    │   Express    │
    │  Static CDN  │                    │  Backend     │
    │  (Frontend)  │                    │  (Port 5000) │
    └──────────────┘                    └──────────────┘
                                               ↓↑
                                    ┌──────────────────────┐
                                    │ Route Handlers       │
                                    ├──────────────────────┤
                                    │ /api/auth/*          │
                                    │ /api/projects/*      │
                                    │ /api/deploy/*        │
                                    │ /api/import/*        │
                                    └──────────────────────┘
                                               ↓↑
                                    ┌──────────────────────┐
                                    │ Business Logic       │
                                    ├──────────────────────┤
                                    │ Services:            │
                                    │ • Auth Service       │
                                    │ • Project Service    │
                                    │ • Deploy Service     │
                                    │ • HTML Parser        │
                                    └──────────────────────┘
                                               ↓↑
                                    ┌──────────────────────┐
                                    │ Data Layer (Prisma)  │
                                    └──────────────────────┘
                                               ↓↑
                                    ┌──────────────────────┐
                                    │ PostgreSQL Database  │
                                    │                      │
                                    │ Tables:              │
                                    │ • Users              │
                                    │ • Projects           │
                                    │ • Deployments        │
                                    └──────────────────────┘
```

---

## Component Architecture - Frontend

### Layer 1: Pages
```
Pages/
├── Builder.jsx        - Main builder interface
├── Projects.jsx       - Project management page
└── WebsiteImport.jsx  - Website scraping interface
```

**Responsibility**: Handle page-level routing and layout

---

### Layer 2: Layout Components
```
Layout/
├── MainLayout.jsx     - Wrapper for all pages
├── LeftPanel.jsx      - Gesture control panel
├── CenterPanel.jsx    - Main content area
├── RightPanel.jsx     - Components library sidebar
└── BottomPanel.jsx    - Code viewer and export
```

**Responsibility**: Structure and styling of UI regions

---

### Layer 3: Feature Components
```
GesturePanel/
├── WebcamFeed.jsx     - Live webcam stream
├── GestureDisplay.jsx - Current gesture display
└── ConfidenceMeter.jsx - Confidence visualization

PageBuilder/
├── Canvas.jsx         - Rendering area for components
├── DraggableComponent.jsx - Individual component render
└── DropZone.jsx       - Drop target for drag-drop

CodePanel/
├── CodeViewer.jsx     - React code display
└── CopyButton.jsx     - Copy to clipboard

ComponentLibrary/
├── Sidebar.jsx        - Components list
└── ComponentItem.jsx  - Draggable component item
```

**Responsibility**: Feature-specific UI and interactions

---

### Layer 4: Core Services (JavaScript)
```
gestures/
├── HandTracker.js     - MediaPipe hand detection
├── GestureClassifier.js - Hand landmark analysis
└── GestureMappings.js - Gesture-to-action mapping

builder/
├── ComponentGenerator.js - JSX code generation
├── LayoutBuilder.js     - Layout management
└── PreviewRenderer.jsx  - Component rendering

hooks/
├── useWebcam.js         - Webcam stream hook
├── useGestureDetection.js - Gesture detection hook
├── useDragDrop.js       - Drag-drop state hook
└── useCodeGeneration.js - Code generation hook
```

**Responsibility**: Business logic and state management

---

## Data Flow - Gesture to Action

```
1. Webcam Stream (30 FPS)
        ↓
2. Frame Capture (100ms interval)
        ↓
3. MediaPipe Hand Detection
   └─→ 21-point landmarks per hand
        ↓
4. Gesture Classification
   ├─ Distance calculations
   ├─ Finger open/close detection
   └─ Pattern matching
        ↓
5. Gesture Action Mapping
   ├─ open_palm → SELECT_COMPONENT
   ├─ thumbs_up → CONFIRM_ADD
   ├─ two_fingers → ENABLE_DRAG
   ├─ closed_fist → DELETE_COMPONENT
   └─ wave → SCROLL_CANVAS
        ↓
6. React State Update
        ↓
7. UI Re-render
        ↓
8. User Sees Result
```

---

## Data Flow - Component to Code

```
1. User Selects Component (click or gesture)
        ↓
2. Component Added to Layout State
   {type: "Button", props: {text: "Click Me"}}
        ↓
3. Layout Array Updated
   [{type: "Navbar"}, {type: "Button"}]
        ↓
4. Code Generation Hook Triggered
   useCodeGeneration(layout)
        ↓
5. ComponentGenerator.generateComponentCode()
   ├─ Generate imports
   ├─ Generate JSX for each component
   └─ Generate App.jsx wrapper
        ↓
6. Code State Updated
        ↓
7. CodeViewer Re-renders with New Code
        ↓
8. User Can Copy Code
```

---

## Backend Architecture

### Entry Point
```javascript
server.js
├─ Express app initialization
├─ Middleware setup (CORS, JSON parsing)
├─ Route registration
└─ Error handling
```

### Middleware Pipeline
```
Request
  ↓
1. CORS Middleware
  ↓
2. JSON Parser
  ↓
3. Auth Middleware (for protected routes)
  ↓
4. Route Handler
  ↓
Response
```

---

### Route Structure

```
/api/
├── /auth/
│   ├── POST /register       - User registration
│   └── POST /login          - User login
│
├── /projects/ (protected)
│   ├── GET /                - List user projects
│   ├── POST /               - Create project
│   ├── GET /:id             - Get project
│   ├── PUT /:id             - Update project
│   └── DELETE /:id          - Delete project
│
├── /deploy/ (protected)
│   ├── POST /               - Deploy to Netlify
│   └── GET /:projectId      - Get deployments
│
└── /import/
    └── POST /               - Import website
```

---

### Controller Pattern

Each controller follows this pattern:

```javascript
// projectController.js
export const getProjects = async (req, res) => {
  // 1. Validate input
  // 2. Check authorization (req.userId)
  // 3. Query database via Prisma
  // 4. Return response
}
```

---

### Database Schema (Prisma)

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String     // bcrypt hash
  createdAt DateTime   @default(now())
  projects  Project[]
}

model Project {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(...)
  projectName String
  layoutJson Json    // Component layout
  reactCode String   // Generated JSX
  createdAt DateTime @default(now())
  deployments Deployment[]
}

model Deployment {
  id            String   @id @default(cuid())
  projectId     String
  project       Project  @relation(...)
  netlifyUrl    String
  deployStatus  String
  deployedAt    DateTime @default(now())
}
```

---

### Service Architecture

**authController.js** → No service (direct Prisma + bcrypt)

**projectController.js** → projectService.js
- `getProjectStats()`
- `validateProjectData()`

**deploymentController.js** → deploymentService.js
- `deployToNetlify(project)`
- `generateProjectFiles()`

**websiteImportController.js** → htmlParserService.js
- `parseWebsite(url)`
- `extractComponents(html)`

---

## Authentication Flow

```
User Registration/Login
        ↓
POST /api/auth/register
or POST /api/auth/login
        ↓
Backend:
1. Hash password (bcryptjs)
2. Query database
3. Compare hashes
4. Generate JWT token
        ↓
Response: { token, userId, email }
        ↓
Frontend:
1. Store token in localStorage
2. Include in Authorization header
        ↓
Authorization: Bearer <token>
        ↓
Backend Auth Middleware:
1. Extract token
2. Verify signature
3. Decode userId
4. Attach to req.userId
        ↓
Route Handler Access req.userId
```

---

## Code Generation Pipeline

```
Layout Array
[
  { type: "Navbar" },
  { type: "Button", props: { text: "Click" } }
]
        ↓
ComponentGenerator.generateComponentCode(layout)
        ↓
For each component in layout:
1. Get component type
2. Generate JSX for type
3. Apply props
4. Wrap in main App div
        ↓
Return formatted JSX string
        ↓
Code displayed in CodeViewer
```

---

## Gesture Recognition Pipeline

```
Hand Detection
├─ Input: Video frame
├─ MediaPipe: Extract 21 landmarks
└─ Landmarks: Normalized coordinates

Gesture Classification
├─ Input: 21 landmarks
├─ Calculate distances between points
├─ Analyze finger positions
├─ Match against gesture patterns
└─ Output: Gesture name + confidence

Gesture Mapping
├─ Input: Gesture + confidence (> 0.7)
├─ Map to action
└─ Trigger UI change

Performance Optimization
├─ Process every 100ms (10 FPS)
├─ Skip frames if busy
├─ Cache landmarks
└─ Debounce actions
```

---

## Deployment Architecture

### Local Development
```
Frontend (Vite HMR)
├─ Port: 3000
├─ Hot reload: Enabled
└─ API: http://localhost:5000

Backend (Nodemon)
├─ Port: 5000
├─ Auto-restart: Enabled
└─ Database: PostgreSQL (localhost)
```

### Production Deployment

```
Frontend → Netlify CDN
├─ Build: npm run build
├─ Output: dist/
├─ Hosting: Netlify
└─ Domain: gesture-ui-xxxx.netlify.app

Backend → Cloud Server
├─ Deploy: git push heroku main
├─ Environment: NODE_ENV=production
├─ Database: PostgreSQL (managed)
└─ Port: 5000 (or assigned by host)
```

---

## Security Architecture

### Password Security
```
User Password
    ↓
bcrypt.hash(password, 10)
    ↓
Stored in Database (never the plain password)
    ↓
On Login:
bcrypt.compare(inputPassword, storedHash)
```

### Token Security
```
User Login
    ↓
jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
    ↓
Token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    ↓
Frontend stores in localStorage
    ↓
Included in Authorization header
    ↓
Backend verifies signature with JWT_SECRET
```

### Database Security
```
Prisma ORM
├─ Parameterized queries (prevents SQL injection)
├─ Type-safe operations
└─ Built-in escaping

User Isolation
├─ All queries filtered by userId
├─ Cascade delete on user removal
└─ No cross-user data access
```

---

## Performance Optimizations

### Frontend
```
Gesture Detection
├─ 10 FPS processing (not 30 FPS)
├─ Skip redundant calculations
└─ Debounce UI updates

Component Rendering
├─ Memoization for components
├─ Lazy loading for heavy components
└─ Virtual scrolling for lists

Code Generation
├─ Cached results
├─ Incremental updates
└─ Debounced re-generation
```

### Backend
```
Database Queries
├─ Eager loading (Prisma include)
├─ Pagination for lists
└─ Database indexes on userId

API Response
├─ Response caching
├─ Compression (gzip)
└─ Connection pooling
```

---

## Scalability Considerations

### Current Architecture (MVP)
- Single PostgreSQL instance
- Single backend server
- Stateless API (can run multiple instances)

### Future Scaling
```
Load Balancer
    ↓
Backend Cluster (multiple instances)
    ↓
Database Replication (master-slave)
    ↓
Cache Layer (Redis)
    ↓
CDN for static assets
    ↓
Microservices if needed
```

---

## Error Handling

### Frontend
```
try-catch blocks around API calls
├─ User-friendly error messages
├─ Error logging to console
└─ Graceful degradation

Component error boundaries (future)
└─ Catch React component errors
```

### Backend
```
Error Handler Middleware
├─ Catch all errors
├─ Log to console
├─ Return JSON response
└─ Status codes: 400, 401, 403, 500

Error Types
├─ Validation: 400
├─ Authentication: 401
├─ Authorization: 403
└─ Server: 500
```

---

## File Upload/Download Flow

### Project Export
```
User clicks Export
    ↓
ComponentGenerator.generateProjectFiles()
    ↓
Create virtual files in memory
├─ package.json
├─ vite.config.js
├─ index.html
├─ src/main.jsx
├─ src/App.jsx
└─ src/index.css
    ↓
Create ZIP archive
    ↓
Download to user computer
```

### Website Import
```
User enters URL
    ↓
POST /api/import { url }
    ↓
Backend:
1. Fetch HTML with fetch()
2. Parse with Cheerio
3. Extract components
4. Return as JSON
    ↓
Frontend displays results
    ↓
User selects components to add
```

---

## Testing Architecture (Future)

```
Unit Tests
├─ Jest for JavaScript
├─ Test components
└─ Test utilities

Integration Tests
├─ API endpoints
├─ Database operations
└─ Auth flow

E2E Tests
├─ Cypress/Playwright
├─ User workflows
└─ Full stack
```

---

## Monitoring & Logging (Future)

```
Frontend
├─ Error tracking (Sentry)
├─ Performance monitoring
└─ User analytics

Backend
├─ Application logging
├─ Database query monitoring
└─ API performance metrics
```

---

For implementation details, see:
- `/client/src` - Frontend code structure
- `/server/src` - Backend code structure
- `README.md` - Feature overview
- `FEATURES.md` - Detailed features
