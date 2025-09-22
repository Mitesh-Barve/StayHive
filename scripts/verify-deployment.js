#!/usr/bin/env node

/**
 * Deployment verification script for StayHive
 * This script checks if the necessary configuration files exist
 */

const fs = require('fs');
const path = require('path');

console.log('StayHive Deployment Verification');
console.log('===============================\n');

// Check if render.yaml exists
const renderYamlPath = path.join(__dirname, '..', 'render.yaml');
if (fs.existsSync(renderYamlPath)) {
    console.log('✓ render.yaml file exists');
} else {
    console.log('✗ render.yaml file is missing');
}

// Check if package.json exists
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
    console.log('✓ package.json file exists');
    
    // Check if it has the required scripts
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.scripts && packageJson.scripts.start) {
        console.log('✓ start script is defined');
    } else {
        console.log('✗ start script is missing');
    }
} else {
    console.log('✗ package.json file is missing');
}

// Check if app.js exists
const appJsPath = path.join(__dirname, '..', 'app.js');
if (fs.existsSync(appJsPath)) {
    console.log('✓ app.js file exists');
    
    // Check if it has a health endpoint
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');
    if (appJsContent.includes('/health')) {
        console.log('✓ health check endpoint is defined');
    } else {
        console.log('✗ health check endpoint is missing');
    }
} else {
    console.log('✗ app.js file is missing');
}

// Check if .env.example exists
const envExamplePath = path.join(__dirname, '..', '.env.example');
if (fs.existsSync(envExamplePath)) {
    console.log('✓ .env.example file exists');
} else {
    console.log('✗ .env.example file is missing');
}

// Check if deployment documentation exists
const deploymentMdPath = path.join(__dirname, '..', 'DEPLOYMENT.md');
if (fs.existsSync(deploymentMdPath)) {
    console.log('✓ DEPLOYMENT.md documentation exists');
} else {
    console.log('✗ DEPLOYMENT.md documentation is missing');
}

console.log('\nDeployment verification complete.');