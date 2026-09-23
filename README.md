# 🎲 Kla Klouk by Kimsan (ខ្លាឃ្លោក ភូមិយើង)

> A modern, casino-grade cross-platform mobile & web application simulating the traditional Cambodian dice game **"Kla Klouk"**, developed by **Ly Kimsan**.

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react)](https://reactnative.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-FFCA28?logo=firebase)](https://firebase.google.com)
[![Developer](https://img.shields.io/badge/Developer-Ly%20Kimsan-gold)](#-author--developer)

---

## ✨ Features

- 🎲 **3D Dice Shaker & Dealer Plate**: Authentic traditional Cambodian bronze bowl with realistic rattling vibration and staggered reveal (Dice 1 at 0.5s, Dice 2 at 1.0s, Dice 3 at 1.5s).
- 🌐 **Real-Time Online Multiplayer (Firebase)**:
  - Create custom rooms with 6-digit invite codes (e.g. `122458`).
  - Join via 1-click shareable URLs (`/?room=122458`).
  - Real-time bet synchronization across all connected players.
  - Synchronized dice rolling so all room participants see the same outcomes simultaneously.
  - Automatic disconnection cleanup (`onDisconnect`).
- 🎨 **Traditional Khmer Aesthetic**:
  - Official Google **Hanuman** typography (`Hanuman_400Regular`, `Hanuman_700Bold`, `Hanuman_900Black`).
  - Ornate Angkor gold filigree (*kbach*) cards for the 6 classic symbols: **ខ្លា (Tiger), ឃ្លោក (Calabash Gourd), មាន់ (Rooster), បង្កង (Shrimp), ក្តាម (Crab), ត្រី (Fish)**.
  - Classic **ក្តាន់ (Deer)** variant option in Settings.
  - Luxury gold 3D dice and tiger medallion favicon & app icon.
- 🔊 **Sound System & Haptics**:
  - Web Audio & Expo AV audio synthesizer.
  - Ceramic chip taps, dice rattles, win fanfare, loss chime, and background ambient music.
- 💼 **Persistent Wallet & Stats**:
  - Local persistence via `AsyncStorage`.
  - Complete history log of past rounds, win rate tracking, and streak records.
  - Free coin top-up bonus (+3,000 coins).

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run Expo development server (Web, Android, iOS)
npx expo start

# 3. Open directly in web browser
npx expo start --web

# 4. Run automated unit tests
npm test
```

---

## ☁️ Deployment to Vercel (1-Click)

This project includes [`vercel.json`](./vercel.json) pre-configured with Single Page Application (SPA) routing and production web export:

1. Import this repository in [Vercel](https://vercel.com/new).
2. Set **Build Command**: `npm run build`
3. Set **Output Directory**: `dist`
4. Click **Deploy**.

---

## 🔑 Firebase Setup for Online Multiplayer

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Realtime Database** (start in *test mode* for open room gameplay).
3. Under Project Settings -> **Your apps** -> **Web (`</>`)**, copy your Firebase config.
4. Set the following environment variables (locally in `.env` or in Vercel Project Settings):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 👨‍💻 Author & Developer

- **Developer**: Ly Kimsan (លី គីមសាន)
- **GitHub**: [@kimsankimsan001](https://github.com/kimsankimsan001)
- **Project**: Kla Klouk by Kimsan
- **License**: MIT
