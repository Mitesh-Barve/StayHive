#!/usr/bin/env node

/**
 * GitHub Setup Helper Script for StayHive
 * This script provides guidance for setting up a GitHub repository
 */

console.log('StayHive GitHub Setup Helper');
console.log('============================\n');

console.log('Follow these steps to create a GitHub repository for StayHive:\n');

console.log('1. Create a new repository on GitHub:');
console.log('   - Go to https://github.com/new');
console.log('   - Name your repository "StayHive"');
console.log('   - Choose Public or Private');
console.log('   - Leave all initialization options unchecked (no README, .gitignore, or license)');
console.log('   - Click "Create repository"\n');

console.log('2. After creating the repository, copy the HTTPS URL which looks like:');
console.log('   https://github.com/YOUR_USERNAME/StayHive.git\n');

console.log('3. Update your local repository\'s remote URL:');
console.log('   git remote set-url origin https://github.com/YOUR_USERNAME/StayHive.git\n');

console.log('4. Push your code to GitHub:');
console.log('   git push -u origin main\n');

console.log('For detailed instructions, see GITHUB_SETUP.md\n');

console.log('Note: Replace YOUR_USERNAME with your actual GitHub username in the URL.');