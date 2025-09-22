#!/usr/bin/env node

/**
 * Deployment helper script for StayHive
 * This script provides guidance for deploying the application to Render
 */

console.log('StayHive Deployment Helper');
console.log('==========================\n');

console.log('To deploy StayHive to Render, follow these steps:\n');

console.log('1. Ensure you have the following accounts:');
console.log('   - Render account (https://render.com)');
console.log('   - MongoDB Atlas account (https://cloud.mongodb.com)');
console.log('   - Cloudinary account (https://cloudinary.com) - optional but recommended\n');

console.log('2. Prepare your environment variables:');
console.log('   - SESSION_SECRET: A random string for session encryption');
console.log('   - MONGO_URI: Your MongoDB connection string');
console.log('   - CLOUD_NAME: Your Cloudinary cloud name (if using Cloudinary)');
console.log('   - CLOUD_API_KEY: Your Cloudinary API key (if using Cloudinary)');
console.log('   - CLOUD_API_SECRET: Your Cloudinary API secret (if using Cloudinary)\n');

console.log('3. Deployment steps:');
console.log('   - Fork this repository to your GitHub account');
console.log('   - Create a new Web Service on Render');
console.log('   - Connect your GitHub repository');
console.log('   - Set the build command to: npm install');
console.log('   - Set the start command to: npm start');
console.log('   - Add all required environment variables');
console.log('   - Deploy the service\n');

console.log('For detailed instructions, see DEPLOYMENT.md or README.md\n');

console.log('Note: Make sure to update the render.yaml file with your specific configuration before deploying.');