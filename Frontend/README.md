# Taskboard Pro Frontend

This project is built with React and Vite, providing a modern and efficient development environment.

## Firebase Configuration Setup

For security reasons, Firebase configuration details are not included in the repository. Follow these steps to set up Firebase for the frontend:

1. Create a `.env` file in the root directory using the provided `.env.example` template
2. Get your Firebase project configuration:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Navigate to Project Settings > General
   - Scroll down to "Your apps" section and copy the config details
   - Add these values to your `.env` file

Alternatively, you can create a file at `src/config/firebaseConfig.js` based on the example provided.

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

## Features

- Hot Module Replacement (HMR)
- ESLint integration
- Modern React development workflow

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
