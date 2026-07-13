# 🌐 Website Link

https://new-weather-app-dun.vercel.app/

# 🌦️ Weather App

A clean, responsive weather application built to demonstrate practical frontend engineering, API integration, and polished user experience.

## ✨ Why This Project Matters

This app is designed as a portfolio-ready product for clients, recruiters, and employers who want to see more than a basic demo. It combines real weather data, useful interaction patterns, persistent user preferences, and a modern React architecture.

## 🚀 Key Features

- 🔍 City search with geocoding
- 📍 Current-location weather lookup
- 🌡️ Current temperature, feels-like data, humidity, wind, rain, sunrise, and sunset
- 🕒 Hourly and multi-day forecast views
- 🌫️ Air quality information
- ☀️ UV index support
- ⭐ Favorite cities saved locally
- 🌙 Light and dark themes
- 🔁 Celsius/Fahrenheit unit toggle
- 📱 Responsive interface for desktop and mobile
- 🛡️ Error handling for API, network, and permission issues

## 🧰 Tech Stack

- ⚛️ React 19
- ⚡ Vite
- 🎨 Ant Design
- 🧭 React Router
- 🔄 TanStack React Query
- 🌐 Axios
- 🖥️ Express
- ☁️ OpenWeatherMap API

## 📦 Getting Started Locally

### 1. Install dependencies

```bash
npm install
npm --prefix frontend install
```

### 2. Add environment variables

Create `frontend/.env`:

```env
VITE_OWM_API_KEY=your_openweathermap_api_key
```

### 3. Run the app

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
npm start
```

## 🗂️ Project Structure

```text
frontend/
  src/
    api/          Weather and air-quality API clients
    components/   Reusable UI components
    hooks/        App-specific React hooks
    pages/        Home and city weather pages
    providers/    Application providers
    store/        Theme, units, and city state
    utils/        Formatting and icon helpers
server.js         Production Express server
vercel.json       Deployment configuration
```

## 📌 Notes

An OpenWeatherMap API key is required for live weather, forecast, UV, geocoding, and air-quality data.
