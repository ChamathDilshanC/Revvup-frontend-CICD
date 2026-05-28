# RevvUp Frontend

Premium motorbike marketplace mobile client built with **React Native**, **Expo**, and **NativeWind** (Tailwind CSS for React Native).

## Features

- **Modern dark UI** — High-contrast surfaces (`#0A0A0B`), accent red (`#E63946`), and refined typography for a luxury catalog feel.
- **Screen modules** — `Explore`, `Catalog`, `Details`, and `Profile` under `screens/`.
- **Reusable components** — `BikeCard`, `PrimaryButton`, and theme tokens in `theme/colors.ts`.
- **API-ready** — Designed to consume the RevvUp FastAPI backend (`GET /api/v1/bikes`, bike details, auth).

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | React Native (Expo)                 |
| Styling      | NativeWind v4 + Tailwind CSS 3      |
| Language     | TypeScript                          |
| Navigation   | Expo Router / React Navigation (TBD)|

## Project Structure

```
revvup-frontend/
├── App.tsx              # Root entry
├── components/          # BikeCard, PrimaryButton, …
├── screens/
│   ├── ExploreScreen.tsx
│   ├── CatalogScreen.tsx
│   ├── DetailsScreen.tsx
│   └── ProfileScreen.tsx
├── theme/
│   └── colors.ts        # Design tokens
├── package.json
└── tailwind.config.js
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) on a physical device, or Android Studio / Xcode for emulators

## Setup

```bash
# From revvup-frontend/
npm install

# Configure API base URL (create .env.local)
# EXPO_PUBLIC_API_URL=https://your-revvup-backend.vercel.app
```

## Run

```bash
npm start          # Expo dev server (QR code)
npm run android    # Android emulator / device
npm run ios        # iOS simulator / device (macOS only)
npm run web        # Web preview
```

## NativeWind

NativeWind maps Tailwind utility classes to React Native styles. Ensure `tailwind.config.js` content paths include your components and screens. Use `className` on supported primitives (`View`, `Text`, `Pressable`, etc.).

Example:

```tsx
<View className="flex-1 bg-[#0A0A0B] px-4">
  <Text className="text-3xl font-bold text-white">Catalog</Text>
</View>
```

## Backend Integration

| Screen    | Endpoint                         |
| --------- | -------------------------------- |
| Catalog   | `GET /api/v1/bikes`              |
| Details   | `GET /api/v1/bikes/{id}`         |
| Profile   | `POST /api/v1/auth/login`, `register` |

Point `EXPO_PUBLIC_API_URL` at your deployed Vercel backend.

## Submodule Note

This repository is a **Git submodule** of [revvup-app](https://github.com/tharakawijayathilaka/revvup-app). Clone the monorepo with:

```bash
git clone --recursive https://github.com/tharakawijayathilaka/revvup-app.git
```

## License

Proprietary — RevvUp © 2026
