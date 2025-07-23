#!/bin/bash

echo "🚀 Deploying backend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "📦 Deploying..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your API will be available at the URL shown above"
echo "📝 Update your .env file with the new API_URL" 