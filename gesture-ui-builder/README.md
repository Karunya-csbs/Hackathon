# Gesture-Based React UI Builder

A production-ready platform that allows users to build React UI layouts using hand gestures captured through their webcam. This system detects gestures, maps them to UI actions, displays component previews, generates React code automatically, and allows one-click deployment to Netlify.

## Features

✨ **Gesture-Based UI Building**
- Real-time hand gesture detection using MediaPipe
- Support for multiple gestures: Open Palm, Thumbs Up, Two Fingers, Closed Fist, Wave
- Gesture-to-action mapping for intuitive UI building

🎨 **Component Library**
- Pre-built React components: Button, Card, Navbar, Input, Grid, Form, Modal, Image
- Visual preview of components
- Drag-and-drop support

💻 **Automatic Code Generation**
- Real-time React code generation
- Clean, formatted JSX output
- Copy-to-clipboard functionality
- Export generated code

📱 **Website Import**
- Parse websites and extract UI components
- Automatically detect common UI patterns
- Convert detected components to React

🚀 **One-Click Deployment**
- Deploy to Netlify with one click
- Generate complete React project structure
- Automatic project file generation

🔐 **Authentication**
- User registration and login
- JWT-based authentication
- Secure project storage

💾 **Project Management**
- Save projects to PostgreSQL database
- Manage multiple projects
- Version history tracking

## Tech Stack

### Frontend
- **React** (18.2.0) - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS
- **React Router** - Client-side routing
- **MediaPipe Hands** - Hand gesture recognition
- **React Webcam** - Webcam integration
- **React DnD** - Drag and drop
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - REST API framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cheerio** - HTML parsing
- **Cors** - Cross-origin requests

### Deployment
- **Netlify** - Static hosting and deployment
- **Netlify API** - Programmatic deployments

### Development
- **Nodemon** - Development server auto-restart
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Project Structure

```
gesture-ui-builder/
├── client/                          # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/              # Main layout components
│   │   │   ├── GesturePanel/        # Gesture detection UI
│   │   │   ├── PageBuilder/         # Canvas and drag-drop
│   │   │   ├── CodePanel/           # Code viewer and export
│   │   │   └── ComponentLibrary/    # Component selector
│   │   ├── gestures/                # Hand tracking and gesture recognition
│   │   ├── builder/                 # Code generation and layout management
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── pages/                   # Page components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                          # Node.js backend
│   ├── src/
│   │   ├── controllers/             # Request handlers
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   ├── middleware/              # Express middleware
│   │   └── server.js                # Express app
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md                        # This file
```

## Prerequisites

- **Node.js** 16+ and npm/yarn
- **PostgreSQL** 12+
- A modern web browser with webcam support
- **Netlify** account (for deployment)

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/gesture-ui-builder.git
cd gesture-ui-builder
```

### 2. Database Setup

Create PostgreSQL database:

```bash
createdb gesture_ui_builder
```

### 3. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
DATABASE_URL=postgresql://user:password@localhost:5432/gesture_ui_builder
JWT_SECRET=your-super-secret-key-change-in-production
NETLIFY_API_TOKEN=your-netlify-token-here
PORT=5000
```

Create database tables:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Start backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file (optional, for API URL)
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

## Usage

### 1. Register & Login

- Navigate to the app
- Create a new account or login
- Receive JWT token for authentication

### 2. Build UI with Gestures

**Step 1:** Navigate to `/builder`

**Step 2:** Click "Allow" to access your webcam

**Step 3:** Perform hand gestures:
- **Open Palm**: Select/activate component
- **Thumbs Up**: Confirm adding component
- **Two Fingers**: Enable drag mode
- **Closed Fist**: Delete component
- **Wave**: Scroll canvas

**Step 4:** Select components from library on right panel

**Step 5:** Drag components into the center canvas

**Step 6:** View generated React code in bottom panel

### 3. Import Website Components

- Navigate to `/import`
- Enter a website URL
- System extracts UI components
- Select components to add to builder

### 4. View Generated Code

The bottom panel automatically generates clean React code:

```jsx
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-gray-800 text-white p-4">
        {/* Navbar Component */}
      </nav>
      <button className="bg-blue-500 text-white px-4 py-2">
        Click Me
      </button>
    </div>
  );
}

export default App;
```

### 5. Copy & Export Code

- Click "Copy Code" button to copy to clipboard
- Export for use in your own projects

### 6. Save Project

Click "Save Project" to store layout and code in database

### 7. Deploy to Netlify

- Click "Deploy" button
- System generates complete project structure
- Creates ZIP and uploads to Netlify
- Returns live deployment URL

## API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
```

### Projects
```
GET    /api/projects               Get all user projects
POST   /api/projects               Create new project
GET    /api/projects/:id           Get project by ID
PUT    /api/projects/:id           Update project
DELETE /api/projects/:id           Delete project
```

### Deployment
```
POST   /api/deploy                 Deploy project to Netlify
GET    /api/deploy/:projectId      Get deployment history
```

### Import
```
POST   /api/import                 Import website components
```

## Gesture Detection

The system uses **MediaPipe Hands** for hand landmark detection:

1. **Input**: Webcam stream (30 FPS)
2. **Processing**: Hand landmark detection
3. **Classification**: 21-point hand landmarks analyzed
4. **Output**: Gesture classification with confidence

### Gesture Recognition Algorithm

- **Open Palm**: All 5 fingers extended from wrist
- **Thumbs Up**: Thumb extended upward, others folded
- **Two Fingers**: Index and middle fingers extended
- **Closed Fist**: All fingers folded, compact hand
- **Wave**: Lateral hand movement detected

Gesture detection runs at **10 FPS** for optimal performance.

## Code Generation

The system generates React components dynamically:

1. **Layout JSON**: Array of component definitions
2. **Code Generation**: Components converted to JSX
3. **Code Output**: Clean, formatted React code
4. **Export**: Copy or download generated code

Example layout JSON:

```json
[
  { "type": "Navbar" },
  { "type": "Card", "props": { "title": "Welcome" } },
  { "type": "Button", "props": { "text": "Click Me" } }
]
```

## Website Scraping

The `/import` endpoint:

1. Fetches website HTML
2. Parses DOM using Cheerio
3. Detects UI components:
   - Buttons
   - Forms
   - Cards
   - Navigation
   - Images
   - Grids/Layouts
4. Returns component list
5. User selects components to add

## Deployment to Netlify

The deployment process:

1. Generate React project files
   - `package.json`
   - `vite.config.js`
   - `index.html`
   - `src/main.jsx`
   - `src/App.jsx`
   - `src/index.css`

2. Create project ZIP

3. Call Netlify API to create site

4. Upload ZIP to deployment endpoint

5. Return live URL

Example deployment response:

```json
{
  "message": "Deployment successful",
  "url": "https://gesture-ui-abc12345.netlify.app",
  "deployment": {
    "id": "dep_123",
    "projectId": "proj_456",
    "netlifyUrl": "https://gesture-ui-abc12345.netlify.app",
    "deployStatus": "success",
    "deployedAt": "2024-03-05T10:30:00Z"
  }
}
```

## Database Schema

### Users
```sql
CREATE TABLE "User" (
  id          STRING PRIMARY KEY,
  email       STRING UNIQUE NOT NULL,
  password    STRING NOT NULL,
  createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Projects
```sql
CREATE TABLE "Project" (
  id          STRING PRIMARY KEY,
  userId      STRING FOREIGN KEY,
  projectName STRING NOT NULL,
  layoutJson  JSON,
  reactCode   TEXT,
  createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Deployments
```sql
CREATE TABLE "Deployment" (
  id            STRING PRIMARY KEY,
  projectId     STRING FOREIGN KEY,
  netlifyUrl    STRING,
  deployStatus  STRING DEFAULT 'pending',
  deployedAt    DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Security

- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Tokens**: 7-day expiration
- **Protected Routes**: All project endpoints require authentication
- **CORS**: Configured for frontend domain only
- **Environment Variables**: Sensitive data in .env files

## Performance Optimization

- **Gesture Detection**: Throttled to 10 FPS
- **Component Rendering**: Memoization and lazy loading
- **Code Generation**: Cached and optimized
- **WebCam**: Efficient frame capture every 100ms

## Troubleshooting

### Webcam Not Working
- Check browser permissions
- Ensure HTTPS on production (required for getUserMedia)
- Try different browser

### Gesture Not Detected
- Ensure good lighting
- Position hand clearly in frame
- Increase gesture confidence threshold

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -d gesture_ui_builder

# Recreate database if needed
npm run prisma:migrate reset
```

### API Not Responding
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check environment variables
cat server/.env
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/gesture_ui_builder
JWT_SECRET=your-super-secret-key
NETLIFY_API_TOKEN=your-token
NODE_ENV=development
PORT=5000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## Development Workflow

1. **Feature Branch**: `git checkout -b feature/your-feature`
2. **Make Changes**: Edit files
3. **Test Locally**: `npm run dev`
4. **Commit**: `git commit -m "Add feature"`
5. **Push**: `git push origin feature/your-feature`
6. **Pull Request**: Create PR to main

## Building for Production

### Frontend
```bash
cd client
npm run build
```

Output: `dist/` folder ready for deployment

### Backend
```bash
cd server
npm run start
```

## Deployment

### Deploy Frontend to Netlify

```bash
# Option 1: Manual
npm run build
# Connect dist/ folder to Netlify

# Option 2: Using CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy Backend

Options:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **AWS EC2**: Deploy Node app
- **DigitalOcean**: SSH and run `npm start`

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## Roadmap

- [ ] Advanced gesture recognition (ML model)
- [ ] Component style customization UI
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Export to different formats (Next.js, Vue)
- [ ] Template library
- [ ] Component testing framework
- [ ] Analytics dashboard

## License

MIT License - feel free to use for personal and commercial projects

## Support

For issues, questions, or suggestions:
- Open GitHub Issues
- Create Discussions
- Contact: support@gestureui.dev

## Credits

Built with ❤️ using:
- MediaPipe for gesture recognition
- React for UI
- Prisma for database
- Netlify for deployment

---

**Happy Building! 🎉**
