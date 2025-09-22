<<<<<<< HEAD
# 🏡 StayHive – Your Vacation Stay Companion

StayHive is a full-stack vacation rental web application inspired by Airbnb. It allows users to explore, book, and manage vacation homes seamlessly. Built with Node.js, Express, MongoDB, and EJS templates, StayHive delivers a smooth and dynamic booking experience.

🌟 Project Name Meaning
StayHive is a combination of two words:

Stay – A comfortable place to stay during your vacation.

Hive – A busy, active community where people come together.

Together, StayHive represents the idea of finding comfortable vacation homes in a vibrant community – exactly what the app helps users find and book!

# ✨ Features

🔍 Browse and search vacation listings

📆 Book stays with date selection

📩 Email confirmations and PDF booking tickets

👤 User profiles with booking history

🖼️ Cloudinary integration for image uploads

🔐 Authentication & authorization with Passport.js

# 🔧 Tech Stack
Backend: Node.js, Express.js, MongoDB, Mongoose

Frontend: EJS Templates, Bootstrap/CSS

Authentication: Passport.js (Google & Local Strategy)

File Storage: Cloudinary

Email Service: Nodemailer

# 🚀 Project Goal

StayHive aims to simulate a real-world vacation rental platform, helping developers understand full-stack architecture, secure payment integration, and user-friendly booking flows.

# Screenshots

![Screenshot 2025-06-20 102017](https://github.com/user-attachments/assets/e3b8694f-762f-4e99-af85-43b95d1cf4b8)

![Screenshot 2025-06-20 102042](https://github.com/user-attachments/assets/0b9b6f54-0869-4882-975f-02d87e053188)

![Screenshot 2025-06-20 102059](https://github.com/user-attachments/assets/c55f772d-ffc8-452d-8b4b-7ed2d50fd52f)

![Screenshot 2025-06-20 102132](https://github.com/user-attachments/assets/d4a64092-c16d-42f9-aa33-0456b9c49fca)

![Screenshot 2025-06-20 102144](https://github.com/user-attachments/assets/a23a1bfa-d55f-4170-a14b-4ef0659f1a74)

![Screenshot 2025-06-20 102212](https://github.com/user-attachments/assets/368627b5-4905-4c21-9c04-2ba4eb2fc6a2)

![Screenshot 2025-06-20 102230](https://github.com/user-attachments/assets/a5f7d241-5737-41a5-9ed2-669b822e23ec)

![Screenshot 2025-06-20 102251](https://github.com/user-attachments/assets/c7bc77cb-6d66-46e5-993a-87a5692fc410)

![Screenshot 2025-06-20 102306](https://github.com/user-attachments/assets/f6b02248-03e3-40e9-b1b0-eaabedcf8c9a)

![Screenshot 2025-06-20 102328](https://github.com/user-attachments/assets/e5b43d63-4218-42a1-bd05-10667a0b916e)

![Screenshot 2025-06-20 102346](https://github.com/user-attachments/assets/e44d352a-7f23-4312-9e10-865dac20d6d6)

# 🚀 Deployment

## Deploying to Render

### Prerequisites
1. A Render account (sign up at https://render.com)
2. A MongoDB database (MongoDB Atlas recommended)
3. A Cloudinary account for image hosting (optional but recommended)

### Deployment Steps

1. Fork this repository to your GitHub account
2. Create an account at [Render](https://render.com/)
3. Click "New+" and select "Web Service"
4. Connect your GitHub account and select your forked repository
5. Fill in the following settings:
   - Name: stayhive (or any name you prefer)
   - Region: Choose the region closest to you
   - Branch: main
   - Root Directory: Leave blank
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add the following environment variables in the "Advanced" section:
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `SESSION_SECRET`: A random string for session security (e.g., "your-random-session-secret")
   - `MONGO_URI`: Your MongoDB connection string (e.g., mongodb+srv://username:password@cluster.mongodb.net/stayhive)
   - `CLOUD_NAME`: Your Cloudinary cloud name (if using Cloudinary)
   - `CLOUD_API_KEY`: Your Cloudinary API key (if using Cloudinary)
   - `CLOUD_API_SECRET`: Your Cloudinary API secret (if using Cloudinary)
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID (optional)
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret (optional)
   - `GOOGLE_CALLBACK_URL`: https://your-app-name.onrender.com/auth/google/callback (optional)
7. Click "Create Web Service"
8. Wait for the deployment to complete (this may take several minutes)

### MongoDB Setup
1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a new database user with read/write permissions
4. Add your Render service IP to the IP whitelist (or allow access from anywhere for testing)
5. Get your connection string from the "Connect" button
6. Replace the placeholders in the connection string with your database user credentials

### Cloudinary Setup (Optional)
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add these as environment variables in your Render service

## Environment Variables

Make sure to set all the environment variables from the `.env` file in your Render dashboard.

## Troubleshooting

If you encounter issues during deployment:

1. Check the build logs in the Render dashboard for error messages
2. Ensure all required environment variables are set correctly
3. Verify your MongoDB connection string is correct and the database is accessible
4. Make sure your Google OAuth credentials (if used) are correctly configured

For more detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).
=======
# StayHive
A full-stack vacation rental web application
>>>>>>> 45611250aac399e0754e25b5565a387c8d88c5ea
