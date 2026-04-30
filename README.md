# Goals Mobile App

Initial Expo SDK 55 project for the goals mobile app.

## Setup

1. Install dependencies

   ```bash
   bun install
   ```

2. Start the app

   ```bash
   bun expo start --dev-client
   ```

This project targets development builds, not Expo Go.

## Scripts

- `bun expo lint` checks the Expo project.
- `bun run ios` starts the iOS target.
- `bun run android` starts the Android target.
- `bun run web` starts the web target.

## Stack

- Expo SDK 55
- Expo Router
- TypeScript
- Bun
- Expo development build

## Project Structure

- `src/app`: Expo Router route files only.
- `src/features/goals`: goal screens, components, and domain contracts.
- `src/shared/db`: SQLite-facing schema constants, migrations, and repository contracts.
- `src/shared/date`: local calendar date contracts and future date helpers.
- `src/shared/theme`: shared visual tokens.
- `src/shared/ui`: reusable app UI primitives.
- `src/shared/reminders`: placeholder for future reminders work.
