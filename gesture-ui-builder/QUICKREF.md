# 🚀 QUICK REFERENCE CARD

## Gesture-Based React UI Builder - Complete Platform

---

## ONE-MINUTE SETUP

```bash
# Mac/Linux
cd gesture-ui-builder && ./start.sh

# Windows
cd gesture-ui-builder && start.bat

# Opens on: http://localhost:3000
```

---

## 5-MINUTE MANUAL SETUP

```bash
# Backend
cd server
npm install
cp .env.example .env
# Edit .env with DATABASE_URL
npm run prisma:generate
npm run prisma:migrate
npm run dev  # Runs on port 5000

# Frontend (new terminal)
cd client
npm install
npm run dev  # Runs on port 3000
```

---

## WHAT YOU GET

✅ Gesture detection (5 types)
✅ 8 React components
✅ Real-time code generation
✅ Website import capability
✅ One-click Netlify deployment
✅ User authentication
✅ PostgreSQL database
✅ Full REST API

---

## KEY FILES

**Frontend Entry**: `client/src/App.jsx`
**Backend Entry**: `server/src/server.js`
**Database Schema**: `server/prisma/schema.prisma`
**Main Builder**: `client/src/pages/Builder.jsx`

---

## ENVIRONMENT VARIABLES

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/gesture_ui_builder
JWT_SECRET=your-32-character-secret-key
NETLIFY_API_TOKEN=your-netlify-token
NODE_ENV=development
PORT=5000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

---

## API ENDPOINTS (11 total)

### Auth (Public)
- POST /api/auth/register
- POST /api/auth/login

### Projects (Protected)
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- PUT /api/projects/:id
- DELETE /api/projects/:id

### Deploy (Protected)
- POST /api/deploy
- GET /api/deploy/:projectId

### Import (Public)
- POST /api/import

---

## DATABASE STRUCTURE

```sql
Users (id, email, password)
Projects (id, userId, projectName, layoutJson, reactCode)
Deployments (id, projectId, netlifyUrl, deployStatus)
```

---

## GESTURES SUPPORTED

🖐️  **Open Palm** → Select Component
👍 **Thumbs Up** → Confirm Add
✌️  **Two Fingers** → Enable Drag
✊ **Closed Fist** → Delete Component
👋 **Wave** → Scroll Canvas

---

## COMPONENTS INCLUDED

- Button
- Card
- Navbar
- Input
- Grid
- Form
- Modal
- Image

---

## DEPLOYMENT URLS

**Frontend**: Netlify, Vercel, AWS S3
**Backend**: Heroku, Railway, AWS EC2
**Database**: PostgreSQL (managed)

---

## TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env |
| DB connection error | Check DATABASE_URL |
| Webcam not working | Check browser permissions |
| Gesture not detected | Improve lighting |
| API not responding | Verify VITE_API_URL |

---

## DOCUMENTATION ROADMAP

1. **Start**: INDEX.md (where you are)
2. **Setup**: SETUP_GUIDE.md (15 min)
3. **Learn**: README.md (comprehensive)
4. **Build**: FEATURES.md (what you can do)
5. **Understand**: ARCHITECTURE.md (how it works)
6. **Integrate**: API.md (API reference)
7. **Configure**: ENV_CONFIG.md (env setup)
8. **Deploy**: README.md#Production (go live)

---

## TECH STACK

**Frontend**: React 18 + Vite + TailwindCSS
**Backend**: Node.js + Express + Prisma
**Database**: PostgreSQL
**Deployment**: Netlify API

---

## PROJECT STATUS

✅ 100% Complete
✅ Production Ready
✅ Fully Documented
✅ Ready to Deploy

---

## NEXT ACTIONS

1. Read SETUP_GUIDE.md
2. Run ./start.sh or start.bat
3. Open http://localhost:3000
4. Try building UI with gestures
5. Deploy when ready

---

**Happy Building! 🎉**

For more help: See INDEX.md
