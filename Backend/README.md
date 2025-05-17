# Taskboard Pro Backend

## Firebase Configuration Setup

For security reasons, the Firebase service account key is not included in the repository. Follow these steps to set up Firebase authentication:

1. Create a `.env` file in the root directory using the provided `.env.example` template
2. Get your Firebase service account credentials:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Navigate to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the downloaded JSON file as `serviceAccountKey.json` in the `config` directory

Alternatively, you can add the Firebase configuration values directly to your `.env` file and update the application code to use those environment variables instead of reading from the JSON file.

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up Firebase configuration as described above

3. Start the development server:
   ```
   npm run dev
   ```
