# Setup & Deployment Guide

Quick start guide to get the Gesture UI Builder running locally and deploy to production.

## Quick Start (5 minutes)

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Git

### 1. Clone & Setup Database

```bash
git clone https://github.com/yourusername/gesture-ui-builder.git
cd gesture-ui-builder

# Create PostgreSQL database
createdb gesture_ui_builder

# Or if using Windows command line
psql -U postgres -c "CREATE DATABASE gesture_ui_builder;"
```

### 2. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# EDIT .env - Update DATABASE_URL with your credentials:
# Windows: Edit with Notepad or VS Code
# Linux/Mac: nano .env

# Initialize database
npm run prisma:generate
npm run prisma:migrate

# Start server (runs on localhost:5000)
npm run dev
```

### 3. Setup Frontend

```bash
cd ../client

# Install dependencies
npm install

# Start dev server (runs on localhost:3000)
npm run dev
```

✅ **Done!** Open http://localhost:3000 in your browser

---

## Full Installation Guide

### Step 1: System Requirements

**Windows, Mac, or Linux**

Install Node.js from https://nodejs.org/ (16.0.0 or higher)

Verify installation:
```bash
node --version
npm --version
```

**PostgreSQL**

- Windows: Download from https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql` or download from https://www.postgresql.org/download/macosx/
- Linux: `sudo apt-get install postgresql-12` (Ubuntu/Debian)

Start PostgreSQL:
```bash
# Windows: Service auto-starts
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Step 2: Clone Repository

```bash
git clone https://github.com/yourusername/gesture-ui-builder.git
cd gesture-ui-builder
ls  # or 'dir' on Windows - should see: client, server, README.md
```

### Step 3: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql prompt:
CREATE DATABASE gesture_ui_builder;
\q  # Exit psql

# Verify
psql -U postgres -d gesture_ui_builder -c "\dt"  # Should be empty
```

### Step 4: Backend Configuration

```bash
cd server

# Install all dependencies
npm install

# Copy example environment file
cp .env.example .env

# EDIT .env file with your settings:
```

**Edit `server/.env`:**

```env
# PostgreSQL connection
# Windows/Linux default:
DATABASE_URL=postgresql://postgres:password@localhost:5432/gesture_ui_builder

# OR if you created a dedicated database user:
DATABASE_URL=postgresql://gesture_user:gesture_pass@localhost:5432/gesture_ui_builder

# JWT secret for authentication (use a strong random string)
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Netlify API token (get from https://app.netlify.com/user/applications/personal-access-tokens)
NETLIFY_API_TOKEN=your-netlify-token-here

# Server settings
NODE_ENV=development
PORT=5000
```

**Initialize Database:**

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# You should see output:
# ✔ Generated Prisma Client (v5.3.1) to ./node_modules/@prisma/client in 123ms
# ✔ Created migration files
```

**Verify Database Setup:**

```bash
# Connect to database
psql -U postgres -d gesture_ui_builder

# List tables - should see User, Project, Deployment:
\dt

# Exit
\q
```

**Start Backend:**

```bash
# Terminal in server/ directory
npm run dev

# Should output:
# Server running on port 5000
# Database connected
```

Leave this terminal running.

### Step 5: Frontend Setup

**Open new terminal/command prompt:**

```bash
# Navigate to client directory
cd client  # from gesture-ui-builder root

# Install dependencies
npm install

# Optional: Create .env.local for custom API URL
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev

# Should output:
# VITE v4.4.9 ready in 256 ms
# ➜ Local: http://localhost:3000/
# ➜ press h to show help
```

### Step 6: Access Application

Open your browser and navigate to:

```
http://localhost:3000
```

✅ **The app is running!**

---

## First Steps in the App

1. **Register Account**
   - Click "Sign Up"
   - Enter email and password
   - You're logged in automatically

2. **Try Builder**
   - Navigate to "/builder"
   - Click "Allow" for webcam access
   - Perform hand gestures:
     - Open hand: Open Palm
     - Thumbs up: Thumbs Up
     - Two fingers extended: Two Fingers
   - See gesture detected in left panel

3. **Build UI**
   - Select components from right panel (Button, Card, etc.)
   - Click "Add Component"
   - See component in center preview
   - View generated React code in bottom panel

4. **Save & Deploy**
   - Click "Save Project" (requires backend connection)
   - Click "Deploy" to deploy to Netlify (requires token)

---

## Production Deployment

### Backend Deployment (Heroku Example)

```bash
# Login to Heroku
heroku login

# Create app
heroku create my-gesture-ui-backend

# Set environment variables
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set JWT_SECRET="your-secret"
heroku config:set NETLIFY_API_TOKEN="your-token"
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Backend Deployment (AWS EC2 Example)

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-instance.com

# Install Node and PostgreSQL
sudo amazon-linux-extras install nodejs15
sudo yum install postgresql

# Clone repo
git clone <your-repo>
cd gesture-ui-builder/server

# Setup environment
export DATABASE_URL="..."
export JWT_SECRET="..."
npm install

# Start with PM2 (process manager)
npm install -g pm2
pm2 start src/server.js --name "gesture-backend"
pm2 startup
pm2 save
```

### Frontend Deployment (Netlify)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
cd client
npm run build

# Deploy
netlify deploy --prod --dir=dist

# You'll get a live URL: https://your-app.netlify.app
```

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Update VITE_API_URL environment variable in Vercel dashboard
# Set to your backend URL
```

### Database Backup

```bash
# Backup PostgreSQL database
pg_dump -U postgres gesture_ui_builder > backup.sql

# Restore database
psql -U postgres -d gesture_ui_builder < backup.sql
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000 (backend)
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000

# Kill process (Windows):
taskkill /PID <PID> /F

# Kill process (Mac/Linux):
kill -9 <PID>
```

### Webcam Permission Denied

- Check browser permissions
- Go to browser Settings > Privacy > Camera
- Allow access to localhost:3000
- Reload page

### PostgreSQL Connection Error

```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check connection string in .env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Test connection directly
psql -U postgres -d gesture_ui_builder
```

### Database Migration Failed

```bash
# Reset database (DELETES ALL DATA)
npm run prisma:migrate reset

# Verify schema
npm run prisma:generate
```

### Module Not Found Error

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# For backend
cd server
npm install

# For frontend
cd ../client
npm install
```

### CORS Error

Update backend CORS in `server/src/server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',  // Your frontend URL
  credentials: true
}));
```

### API Connection Issues

```bash
# Test backend is running
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-03-05T..."}

# Check frontend .env.local
cat client/.env.local  # Should have VITE_API_URL set
```

---

## Development Tips

### Hot Module Reload

Both frontend (Vite) and backend (Nodemon) support hot reload:
- **Frontend**: Changes auto-reflect in browser
- **Backend**: Changes auto-restart server

### Debug Mode

```bash
# Backend with debug logging
NODE_DEBUG=* npm run dev

# Frontend with React DevTools
# Install "React Developer Tools" browser extension
```

### Database Inspection

```bash
# View database schema
npm run prisma:studio  # Opens web UI at localhost:5555

# Or use CLI
psql -U postgres -d gesture_ui_builder -c "SELECT * FROM \"User\";"
```

### Build for Production

```bash
# Frontend
cd client
npm run build
# Output in: dist/

# Backend (just run with node)
cd ../server
NODE_ENV=production node src/server.js
```

---

## Next Steps

1. **Customize Components** - Add more UI components in `client/src/builder/ComponentGenerator.js`

2. **Improve Gesture Detection** - Train ML model on hand gestures

3. **Add More Export Options** - Generate Next.js, Vue, or Tailwind configs

4. **Real-time Collaboration** - Add WebSocket support for multi-user editing

5. **Mobile App** - Build React Native version

---

## Getting Help

**Common Issues & Solutions:**
- Check logs in terminal (both frontend and backend)
- Verify environment variables are set correctly
- Ensure database is running
- Check network tab in browser DevTools for API errors

**Resources:**
- React: https://react.dev
- Express: https://expressjs.com
- Prisma: https://www.prisma.io/docs
- MediaPipe: https://github.com/google/mediapipe

---

## Support

For issues:
1. Check error messages in terminal
2. Review this guide
3. Open GitHub Issue with:
   - Error message
   - Steps to reproduce
   - System info (OS, Node version)
   - Terminal output

Happy deploying! 🚀
