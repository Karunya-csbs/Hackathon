# Environment Configuration Guide

## Environment Variables Reference

Complete guide to all environment variables used in the Gesture UI Builder platform.

---

## Backend Environment Variables (.env)

### Database Configuration

```env
# PostgreSQL Connection String
DATABASE_URL=postgresql://username:password@host:port/database

# Examples:
# Local development (Windows):
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gesture_ui_builder

# Local development (Mac/Linux):
DATABASE_URL=postgresql://postgres:password@localhost:5432/gesture_ui_builder

# Managed PostgreSQL:
DATABASE_URL=postgresql://user:pass@db.example.com:5432/gesture_ui_builder

# With SSL (production):
DATABASE_URL=postgresql://user:pass@db.example.com:5432/gesture_ui_builder?sslmode=require
```

**Components**:
- `postgresql://` - Protocol
- `username:password` - Database credentials
- `host` - Server hostname/IP
- `port` - Database port (default: 5432)
- `database` - Database name

---

### Authentication Configuration

```env
# JWT Secret Key (for token signing/verification)
DEBUG JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Requirements:
# - Minimum 32 characters
# - Use strong random string
# - Change in production
# - Don't commit to git

# Generate secure key:
# Linux/Mac:
# openssl rand -base64 32

# Windows PowerShell:
# [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

---

### Deployment Configuration

```env
# Netlify API Token
NETLIFY_API_TOKEN=nf_your_netlify_api_token_here

# How to get:
# 1. Go to https://app.netlify.com/user/applications/personal-access-tokens
# 2. Click "New access token"
# 3. Give it a name (e.g., "Gesture UI")
# 4. Copy the token
# 5. Paste in .env
```

---

### Server Configuration

```env
# Node Environment
NODE_ENV=development
# Options:
# - development (default, verbose logging)
# - production (minimal logging, optimized)

# Server Port
PORT=5000
# Change if 5000 is already in use
```

---

### Complete Backend .env Example

```env
# Database
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/gesture_ui_builder

# Authentication
JWT_SECRET=ab123cde456fgh789ijk000lmn111opq222rst333uvw444xyz555

# Deployment
NETLIFY_API_TOKEN=nf_your_token_here

# Server
NODE_ENV=development
PORT=5000

# Optional: For debugging
DEBUG=gesture-ui:*
```

---

## Frontend Environment Variables (.env.local)

### API Configuration

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Examples:
# Local development:
VITE_API_URL=http://localhost:5000/api

# Production:
VITE_API_URL=https://your-backend.example.com/api

# Netlify Functions:
VITE_API_URL=/.netlify/functions/api
```

---

### Complete Frontend .env.local Example

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Optional: Analytics
VITE_ANALYTICS_ID=UA-1234567-89

# Optional: Environment indicator
VITE_ENV=development
```

---

## Platform-Specific Setup

### macOS

```bash
# .env file location
nano ~/.bash_profile

# Add:
export DATABASE_URL="postgresql://..."
export JWT_SECRET="..."
export NETLIFY_API_TOKEN="..."

# Reload
source ~/.bash_profile
```

---

### Windows

#### Using .env file (Recommended)
```
server/.env
DATABASE_URL=postgresql://...
JWT_SECRET=...
NETLIFY_API_TOKEN=...
```

#### Using System Environment Variables
```powershell
# Open Command Prompt as Administrator

# Set DATABASE_URL
setx DATABASE_URL "postgresql://..."

# Set JWT_SECRET
setx JWT_SECRET "your-secret"

# Set NETLIFY_API_TOKEN
setx NETLIFY_API_TOKEN "your-token"

# Verify
echo %DATABASE_URL%
```

---

### Linux

```bash
# Create .env file
touch server/.env

# Edit with nano or vim
sudo nano server/.env

# Or use environment variables
export DATABASE_URL="postgresql://..."
export JWT_SECRET="..."
export NETLIFY_API_TOKEN="..."

# Make persistent (add to ~/.bashrc)
echo 'export DATABASE_URL="..."' >> ~/.bashrc
source ~/.bashrc
```

---

## PostgreSQL Connection Strings

### Local Connection

**macOS/Linux (Unix Socket)**:
```
DATABASE_URL=postgresql:///gesture_ui_builder
# Uses default user (postgres) via Unix socket
```

**Windows/TCP Connection**:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/gesture_ui_builder
```

### Remote Connection

```
DATABASE_URL=postgresql://user:password@db.example.com:5432/gesture_ui_builder
```

### Cloud Providers

**Heroku PostgreSQL**:
```
DATABASE_URL=postgresql://username:password@ec2-...amazonaws.com:5432/dbname
```

**AWS RDS**:
```
DATABASE_URL=postgresql://admin:password@gesture-db.c9akciq32.us-east-1.rds.amazonaws.com:5432/gesture_ui_builder
```

**Railway**:
```
DATABASE_URL=postgresql://user:password@containers-us-west-xyz.railway.app:7432/gesture_ui_builder
```

**Supabase (PostgreSQL)**:
```
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

---

## JWT Secret Generation

### Option 1: OpenSSL (Linux/Mac)
```bash
openssl rand -base64 32
# Output: Ab12cd34ef56gh78ij90kl12mn34op56qr78st90uv==
```

### Option 2: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Output: Ab12cd34ef56gh78ij90kl12mn34op56qr78st90uv==
```

### Option 3: Python
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
# Output: Ab12cd34ef56gh78ij90kl12mn34op56qr78st90uv
```

### Option 4: Windows PowerShell
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

---

## Netlify API Token Setup

### Getting Your Token

1. **Login to Netlify**
   - Go to https://app.netlify.com/

2. **Navigate to Access Tokens**
   - Click profile avatar (top right)
   - Select "User settings"
   - Go to "Applications" tab
   - Click "Manage personal access tokens"

3. **Create New Token**
   - Click "New access token" button
   - Name it: "Gesture UI Builder"
   - Copy the token (won't be shown again!)

4. **Save to .env**
   ```env
   NETLIFY_API_TOKEN=nf_1234567890abcdefghijk
   ```

### Testing Your Token

```bash
# Test with curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.netlify.com/api/v1/user

# Expected response:
# {"id":"...", "email":"...", "name":"..."}
```

---

## Development vs Production

### Development Environment

```env
# Backend
DATABASE_URL=postgresql://postgres@localhost:5432/gesture_ui_builder
JWT_SECRET=any-32-character-string-works-for-dev-uj1z2x3v
NETLIFY_API_TOKEN=dev-token-not-used-locally
NODE_ENV=development
PORT=5000

# Frontend
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

**Characteristics**:
- Verbose logging
- No rate limiting
- Easy debugging
- Hot module reload

---

### Production Environment

```env
# Backend
DATABASE_URL=postgresql://prod_user:SECURE_PASS@prod-db.example.com:5432/gesture_ui_builder
JWT_SECRET=use-strong-cryptographic-random-string-min-32-chars-x7a2b8c9d
NETLIFY_API_TOKEN=actual-netlify-token-from-production-account
NODE_ENV=production
PORT=5000

# Frontend
VITE_API_URL=https://api.your-domain.com
VITE_ENV=production
```

**Characteristics**:
- Minimal logging
- Rate limiting enabled
- Performance optimized
- Security hardened

---

## Environment Variable Best Practices

### ✅ DO

```env
# Use strong passwords
DATABASE_PASSWORD=sG7kP#mL9qR@xV2wB$cD5nE8tF

# Use full credentials
DATABASE_URL=postgresql://user:password@host:port/db

# Rotate secrets periodically
JWT_SECRET=new-secret-quarterly

# Use environment-specific values
NODE_ENV=production

# Document all variables
# Database connection string
DATABASE_URL=...
```

### ❌ DON'T

```env
# Don't use simple passwords
DATABASE_PASSWORD=password123

# Don't commit .env files
git add server/.env  # WRONG!

# Don't share secrets
JWT_SECRET=show_in_screenshot

# Don't use same secret in dev/prod
# Use different values for each

# Don't hardcode in code
const token = "secret123"  // WRONG!
```

---

## .env File Management

### Creating .env

```bash
# Backend
cd server
cp .env.example .env
# Edit with your values
nano .env

# Frontend
cd ../client
touch .env.local
# Add your values
```

### Git Ignore Setup

```gitignore
# In .gitignore:
.env
.env.local
.env.*.local
```

### Verifying .env

```bash
# Check if file exists
ls -la .env

# Check environment variable is loaded
echo $DATABASE_URL

# Verify backend can read it
npm run dev
```

---

## Troubleshooting

### "cannot find module dotenv"

```bash
# Solution: Install dotenv
npm install dotenv
```

### "Invalid DATABASE_URL"

```bash
# Check format:
postgresql://user:password@host:port/database

# Test connection:
psql $DATABASE_URL
```

### "JWT_SECRET undefined"

```bash
# Verify .env exists
cat .env

# Verify key name is exact: JWT_SECRET (no typos)
# Restart server after changing .env
npm run dev
```

### "Netlify deployment fails"

```bash
# Verify token is correct
curl -H "Authorization: Bearer $NETLIFY_API_TOKEN" \
     https://api.netlify.com/api/v1/user

# Check token has necessary permissions
# Regenerate token if needed
```

---

## Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] DATABASE_URL uses HTTPS/SSL in production
- [ ] NETLIFY_API_TOKEN is valid and rotated
- [ ] .env files are in .gitignore
- [ ] No secrets in source code commits
- [ ] Different secrets for dev/prod
- [ ] Secrets are rotated periodically
- [ ] Environment variables logged safely (no secrets)

---

## Environment Variable Validation

### Add to server.js

```javascript
// Check required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NODE_ENV',
  'PORT'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

console.log('✓ All environment variables configured');
```

---

## Quick Reference

| Variable | Required | Example |
|----------|----------|---------|
| DATABASE_URL | ✅ | postgresql://... |
| JWT_SECRET | ✅ | 32-char random string |
| NETLIFY_API_TOKEN | ✅ | nf_xxxxx |
| NODE_ENV | ✅ | development/production |
| PORT | ❌ | 5000 |
| VITE_API_URL | ✅ (frontend) | http://localhost:5000/api |

---

## Common Issues & Solutions

### Issue: Port 5000 already in use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Issue: Cannot connect to PostgreSQL
```bash
# Verify PostgreSQL is running
psql postgres

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Issue: JWT token not working
```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# Restart server
npm run dev

# Check server console for errors
```

---

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

For API documentation, see [API.md](API.md)
