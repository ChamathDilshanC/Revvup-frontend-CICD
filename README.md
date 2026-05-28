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
- [npm](https://www.npmjs.com/)
- **[Expo Go](https://expo.dev/go)** on your phone (iOS / Android) — same Wi‑Fi as your PC

## Setup (first time)

```powershell
cd revvup-frontend
npm install
copy .env.example .env
```

## Run with Expo Go

```powershell
npm start
```

1. QR code එක terminal එකේ හෝ browser එකේ පෙන්වයි.
2. Phone එකේ **Expo Go** app එක open කරන්න.
3. **Android:** QR scan කරන්න. **iOS:** Camera app එකෙන් QR scan කරන්න.
4. PC සහ phone **එකම Wi‑Fi** network එකේ තිබිය යුතුයි.

Tunnel mode (Wi‑Fi issues):

```powershell
npx expo start --tunnel
```

## Other commands

```powershell
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
npm run web        # Web preview
```

Windows shortcut:

```powershell
.\scripts\start.ps1
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

This repository is a **Git submodule** of [main-application](https://github.com/ChamathDilshanC/main-application). Clone the monorepo with:

```bash
git clone --recursive https://github.com/ChamathDilshanC/main-application.git
```

## License

Proprietary — RevvUp © 2026
