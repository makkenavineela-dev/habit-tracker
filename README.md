# Habit Tracker

A modern, mobile-first daily habit tracker designed to help you build and maintain positive routines. Built with a robust full-stack architecture, it provides an intuitive interface, offline capabilities, and cross-platform native support.

## Features (v1)
- **Daily Habit Logging**: Create, track, and manage your daily habits.
- **Offline-First Support**: Uses local storage via Zustand to ensure reliability without a persistent internet connection.
- **Push Reminders**: Native push notifications via Capacitor to keep you on top of your daily goals.
- **Progress Tracking**: Visualize your streaks and progress via interactive Recharts integrations.
- **Supabase Cloud Sync**: Optionally sync your habits securely across devices using Supabase.
- **Cross-Platform Native**: Runs beautifully on both Android and iOS inside a performant Capacitor webview.

## Architecture & Tech Stack
- **Frontend Framework**: React 19 + Vite
- **Language**: TypeScript (in progress migration)
- **Styling & UI**: Tailwind/CSS, Framer Motion, Lucide React
- **State Management**: Zustand
- **Native Bridge**: Capacitor (iOS & Android)
- **Backend/BaaS**: Supabase

## Setup & Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Web Dev Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to test the PWA version in your browser.

## Native Development (iOS & Android)
This app uses Capacitor to compile the React web app into native iOS and Android binaries.

### Android
```bash
npm run build
npx cap sync android
npx cap open android
```

### iOS
```bash
npm run build
npx cap sync ios
npx cap open ios
```
*(Requires Xcode on macOS)*

## Testing
We use Vitest and React Testing Library for verifying our components and state handlers.
```bash
npm run test
```

## Contributing
Please follow conventional commits and ensure you have run `npm run lint` and `npm run test` before opening any PRs.
