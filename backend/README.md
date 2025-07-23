# Backend API Deployment

This backend contains all the necessary endpoints for the week2 integration tests, including:

## Available Endpoints

### Authentication
- `POST /login` - User login
- `POST /user` - User registration

### Customer Management
- `POST /customer` - Create customer

### Consent Management (Week2 Tests)
- `PATCH /consent/:customer` - Update user consent
- `GET /consent/:customer` - Get user consent status

### Clinician Management (Week2 Tests)
- `PATCH /consentedClinicians/:customer` - Add clinician
- `GET /consentedClinicians/:customer` - Get user's clinicians

### Other Endpoints
- `POST /rapidsteptest` - Save step data
- `GET /riskscore/:email` - Calculate risk score
- `GET /health` - Health check
- `POST /reset` - Reset data (for testing)

## Deployment to Vercel

### Option 1: Using the deployment script
```bash
cd backend
./deploy.sh
```

### Option 2: Manual deployment
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Navigate to backend directory
cd backend

# Deploy to Vercel
vercel --prod
```

### Option 3: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Create a new project
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Deploy

## After Deployment

1. Copy the new Vercel URL (e.g., `https://your-project.vercel.app`)
2. Update the `.env` file in the root directory:
   ```
   API_URL=https://your-project.vercel.app
   ```
3. Run the tests:
   ```bash
   npm test week2
   ```

## Local Development

To run the backend locally:

```bash
cd backend
npm install
npm start
```

The API will be available at `http://localhost:3000` 