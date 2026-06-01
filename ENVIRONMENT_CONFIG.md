# Environment Configuration Guide

## Frontend (.env for Cloudflare, development uses proxy)

### Development (`.env.local` in client directory, if needed)
```env
VITE_API_URL=http://localhost:8000
VITE_APP_ENV=development
```

### Production (`.env.production`)
```env
VITE_API_URL=https://api.radianttrust.org
VITE_APP_ENV=production
```

**Note**: In development and production, the app uses relative `/api` URLs which are proxied:
- **Dev**: Vite proxy to `http://localhost:8000`
- **Production**: Cloudflare Workers proxy to backend URL

## Backend (`.env` in server directory)

### Database
```env
DATABASE_URL=postgresql://user:password@host:5432/radiant_db
DATABASE_ECHO=false  # Set to true for SQL logging
```

### Security
```env
SECRET_KEY=generate-a-strong-random-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Email Configuration (for password reset, verification)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@radianttrust.org
SMTP_PASSWORD=your-app-password-here
SMTP_FROM=Radiant Education <noreply@radianttrust.org>
```

### Redis (for caching, sessions)
```env
REDIS_URL=redis://localhost:6379/0
REDIS_CACHE_TTL=3600  # 1 hour
```

### CORS Configuration
```env
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000","https://radiant-education.pages.dev"]
```

### Payment Processing (Razorpay)
```env
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

### File Storage (Cloudinary)
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Application Settings
```env
APP_NAME=Radiant Education Trust
APP_VERSION=1.0.0
ENVIRONMENT=development  # or production, staging
DEBUG=true  # Set to false in production
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR
```

### Rate Limiting
```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=60  # seconds
```

### Frontend URLs (for redirects, email links)
```env
FRONTEND_URL=http://localhost:5173  # Development
# Or for production
FRONTEND_URL=https://radiant-education.pages.dev
```

### Google Cloud (if using Cloud Storage)
```env
GCP_PROJECT_ID=your-project-id
GCP_STORAGE_BUCKET=radiant-storage
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

## Cloudflare Workers Configuration

### Update `_worker.js` Backend URL
```javascript
// For production
const BACKEND_URL = 'https://your-backend-domain.run.app'

// For staging
const BACKEND_URL = 'https://staging-backend.run.app'
```

### Cloudflare Pages Build Settings
**Build command**:
```bash
cd client && npm install && npm run build
```

**Build output directory**: `dist`

**Root directory**: `client`

**Environment variables**:
- `NODE_VERSION=18` (or 20)

### Wrangler Configuration (`client/wrangler.toml`)
```toml
name = "radiant"
compatibility_date = "2026-06-01"
main = "dist/_worker.js"

[env.production]
route = "radiant.pages.dev/*"

[env.staging]
route = "radiant-staging.pages.dev/*"

[env.preview]
route = "localhost:8787/*"

[assets]
directory = "./dist"
binding = "ASSETS"
```

## Database Setup with Docker

### `docker-compose.yml` for local development
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: radiant
      POSTGRES_PASSWORD: radiant_dev_pass
      POSTGRES_DB: radiant_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U radiant"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Production Deployment

### Cloud Run (Google Cloud)
```bash
# Build image
docker build -t gcr.io/YOUR_PROJECT/radiant-api .

# Push to registry
docker push gcr.io/YOUR_PROJECT/radiant-api

# Deploy
gcloud run deploy radiant-api \
  --image gcr.io/YOUR_PROJECT/radiant-api \
  --platform managed \
  --region asia-south1 \
  --memory 2Gi \
  --set-env-vars "DATABASE_URL=..." \
  --allow-unauthenticated
```

### Heroku (Alternative)
```bash
# Login to Heroku
heroku login

# Create app
heroku create radiant-api

# Set environment variables
heroku config:set DATABASE_URL=postgresql://...
heroku config:set SECRET_KEY=...

# Deploy
git push heroku main
```

### Environment Variables Priority
1. `.env` file (local development)
2. Environment variables set in container/platform
3. `.env.prod` file (if exists)
4. Defaults from `config.py`

### Sensitive Data Management
**DO NOT commit**:
- `.env` files
- `credentials.json` files
- Private keys
- Database passwords

**Use secret management**:
- Cloudflare Secrets
- Google Cloud Secret Manager
- AWS Secrets Manager
- HashiCorp Vault

## Verifying Configuration

### Check Database Connection
```bash
# From server directory
python -c "from src.config import settings; print(settings.database_url)"
python -c "from src.core.database import engine; print(engine.url)"
```

### Check Redis Connection
```bash
redis-cli ping  # Should return PONG
```

### Check API from Frontend
```javascript
// In browser console
fetch('/api/v1/health')
  .then(r => r.json())
  .then(console.log)
```

### Verify All Environment Variables
```bash
# In Python
from src.config import settings
print(settings.dict())
```

## Common Issues & Solutions

### "Cannot connect to database"
- Verify DATABASE_URL format: `postgresql://user:pass@host:port/dbname`
- Ensure PostgreSQL is running
- Check firewall/network rules

### "CORS error in browser"
- Add frontend URL to `CORS_ORIGINS` in .env
- Clear browser cache and restart dev server

### "Static assets not loading in production"
- Verify Cloudflare build output directory is `dist`
- Check `_worker.js` is in dist folder
- Review Cloudflare Pages build logs

### "Token refresh not working"
- Verify `SECRET_KEY` matches between tokens
- Check `REFRESH_TOKEN_EXPIRE_DAYS` is reasonable
- Ensure Redis is configured for token storage

### "Email not sending"
- Verify SMTP credentials are correct
- Check email service allows app passwords
- Review email logs in application

## Security Checklist for Production

- [ ] Set `DEBUG=false` in production
- [ ] Use strong, unique `SECRET_KEY`
- [ ] Enable HTTPS only (no HTTP)
- [ ] Set secure CORS origins (no * wildcard)
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Set up proper logging and monitoring
- [ ] Regular database backups
- [ ] Keep dependencies updated
- [ ] Use security headers middleware
- [ ] Enable CSRF protection if applicable
- [ ] Implement DDoS protection (Cloudflare)
