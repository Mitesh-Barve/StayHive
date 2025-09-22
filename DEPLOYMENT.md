# Deployment Guide for StayHive on Render

This guide will help you deploy the StayHive application on Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A MongoDB database (you can use MongoDB Atlas)
3. A Cloudinary account for image hosting (optional but recommended)

## Steps to Deploy

### 1. Fork the Repository
First, fork this repository to your own GitHub account so you can make changes without affecting the original.

### 2. Create a New Web Service on Render
1. Go to your Render dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: stayhive (or any name you prefer)
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free (or choose a paid plan for better performance)

### 3. Configure Environment Variables
In the Render dashboard, go to your service settings and add the following environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| NODE_ENV | production | Sets the environment to production |
| PORT | 10000 | Port that Render uses for web services |
| SESSION_SECRET | [your-secret] | Secret for session encryption |
| MONGO_URI | [your-mongodb-uri] | MongoDB connection string |
| CLOUD_NAME | [your-cloudinary-name] | Cloudinary cloud name |
| CLOUD_API_KEY | [your-cloudinary-key] | Cloudinary API key |
| CLOUD_API_SECRET | [your-cloudinary-secret] | Cloudinary API secret |
| GOOGLE_CLIENT_ID | [your-google-client-id] | Google OAuth client ID (optional) |
| GOOGLE_CLIENT_SECRET | [your-google-client-secret] | Google OAuth client secret (optional) |
| GOOGLE_CALLBACK_URL | [your-callback-url] | Google OAuth callback URL (optional) |

### 4. MongoDB Setup
You'll need a MongoDB database. You can use MongoDB Atlas:
1. Create a free cluster on MongoDB Atlas
2. Get your connection string
3. Add your Render service IP to the whitelist (or allow all IPs temporarily for testing)
4. Set the MONGO_URI environment variable with your connection string

### 5. Cloudinary Setup (Optional)
For image hosting, you can use Cloudinary:
1. Create a free account on Cloudinary
2. Get your cloud name, API key, and API secret
3. Set the corresponding environment variables

### 6. Deploy
Click "Create Web Service" and Render will automatically deploy your application.

## Notes
- The application will automatically initialize with sample data if the database is empty
- Make sure to update the sample data initialization script if needed
- The application uses port 10000 by default as required by Render
- Health check endpoint is available at `/health`

## Troubleshooting
- If the deployment fails, check the build logs in the Render dashboard
- Ensure all environment variables are set correctly
- Make sure your MongoDB connection string is correct and the database is accessible