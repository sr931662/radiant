# Quick Start Guide - Radiant Education NGO

## Running the Application Locally

### Prerequisites
- Node.js v18+ (for frontend)
- Python 3.9+ (for backend)
- PostgreSQL (for database)
- Redis (for caching/sessions)

## Frontend Setup

### Install Dependencies
```bash
cd client
npm install
```

### Development Server
```bash
npm run dev
```
- Opens at `http://localhost:5173`
- Vite automatically proxies `/api` requests to `http://localhost:8000`
- Hot module reloading enabled

### Production Build
```bash
npm run build
npm run preview
# Or deploy to Cloudflare Pages
npm run cf:deploy
```

## Backend Setup

### Install Dependencies
```bash
cd server
pip install -r requirements.txt
pip install -r requirements-dev.txt  # For development
```

### Environment Setup
Create a `.env` file in the server directory with:
```env
DATABASE_URL=postgresql://user:password@localhost/radiant
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Database Setup
```bash
cd server
# Run migrations
alembic upgrade head

# Seed database (optional)
python scripts/seed_db.py
```

### Run Backend
```bash
cd server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```
- FastAPI docs available at `http://localhost:8000/docs`
- API endpoints available at `http://localhost:8000/api/v1/*`

## Full Stack with Docker

### Using Docker Compose
```bash
cd server
docker-compose up -d
```

This starts:
- FastAPI backend (port 8000)
- PostgreSQL database
- Redis cache
- Celery worker (if configured)

### Nginx Configuration
The backend has Nginx config for production deployments:
```bash
# Copy nginx.conf to your Nginx config directory
cp server/nginx.conf /etc/nginx/conf.d/radiant.conf
```

## Testing Routes

### Test Public Pages
1. Navigate to each route without authentication:
   - `http://localhost:5173/` (Home)
   - `http://localhost:5173/about` (About)
   - `http://localhost:5173/courses` (Courses)
   - `http://localhost:5173/blog` (Blog)
   - etc.

### Create Test Account
1. Go to `http://localhost:5173/register`
2. Create an account with:
   - Email: `test@example.com`
   - Password: `SecurePass123!`
   - Full Name: `Test User`

### Test Admin Features
1. Login with admin account (see seed_db.py for credentials)
2. Navigate to `http://localhost:5173/admin`
3. Access admin dashboard and management pages

### Test API Directly
```bash
# Login to get token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'

# Use token in subsequent requests
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Verification Checklist

### Frontend Routes (No Hashes!)
- ✅ All routes use clean URLs (e.g., `/about` not `/#/about`)
- ✅ Browser navigation (back/forward) works
- ✅ Direct URL access works for all pages
- ✅ Page refresh works without errors

### API Communication
- ✅ Frontend can reach backend API
- ✅ Authentication/logout works
- ✅ API errors display proper messages
- ✅ Forms submit correctly

### Database Operations
- ✅ User registration creates account
- ✅ Blog posts can be created/viewed
- ✅ Courses can be listed
- ✅ Admin operations work in database

### Authentication
- ✅ Protected routes redirect to login
- ✅ Admin routes check permissions
- ✅ Token refresh works
- ✅ Logout clears tokens

## Troubleshooting

### "Cannot GET /api/*" errors
**Solution**: Ensure backend is running on port 8000
```bash
# Check if backend is running
curl http://localhost:8000/health
```

### Vite proxy not working
**Solution**: Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database connection error
**Solution**: Verify DATABASE_URL in .env matches your PostgreSQL setup
```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

### SPA routing issues (404 on refresh)
**Solution**: Already fixed in `_worker.js` for Cloudflare, Vite dev server handles it automatically

### CORS errors in browser console
**Solution**: Ensure `http://localhost:5173` is in `CORS_ORIGINS` in backend .env

## File Structure Quick Reference

```
radiant/
├── client/                # React Vite frontend
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API service functions
│   │   ├── contexts/     # React contexts (auth, etc)
│   │   ├── lib/          # Utilities (api.js, queryClient.js)
│   │   └── layouts/      # Layout components
│   └── vite.config.js    # Vite configuration
│
├── server/               # FastAPI backend
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API route definitions
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Request/response schemas
│   │   ├── services/     # Database operations
│   │   └── main.py       # FastAPI app setup
│   ├── requirements.txt  # Python dependencies
│   └── docker-compose.yml
│
└── IMPLEMENTATION_GUIDE.md  # This documentation
```

## Next Steps

1. ✅ Run frontend and backend locally
2. ✅ Test all public pages load correctly
3. ✅ Create test account and login
4. ✅ Test admin dashboard access
5. ✅ Deploy frontend to Cloudflare Pages
6. ✅ Deploy backend to Cloud Run or similar
7. ✅ Update backend URL in `_worker.js` for production

## Support

For issues or questions:
1. Check the IMPLEMENTATION_GUIDE.md for detailed architecture
2. Review API docs at `http://localhost:8000/docs`
3. Check browser console for client-side errors
4. Check server logs for backend errors
