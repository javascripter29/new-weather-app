# Weather App

A React-based weather application that provides real-time weather data, forecasts, air quality info, and UV levels using the OpenWeatherMap API.

## Tech Stack

- **Frontend:** React 19, Vite 7, Ant Design, TanStack React Query, React Router 7, Axios
- **Backend (production):** Express.js (serves the built frontend static files)
- **API:** OpenWeatherMap API

## Project Structure

```
/
├── server.js           # Express server for production (serves frontend/dist)
├── package.json        # Root scripts: build (installs + builds frontend), start (node server.js)
└── frontend/           # React/Vite application
    ├── vite.config.js  # Vite config: host 0.0.0.0, port 5000, allowedHosts: true
    ├── src/
    │   ├── api/        # OpenWeatherMap API calls (weatherApi.js, airQualityApi.js)
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # HomePage, CityPage
    │   ├── hooks/      # useWeather, useGeolocation
    │   ├── store/      # weatherStore.js (theme + units via useReducer + Context)
    │   ├── providers/  # AppProviders (wraps React Query + weather store)
    │   └── utils/      # Utility functions and icon mappings
    └── package.json
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_OWM_API_KEY` | OpenWeatherMap API key (secret) |
| `VITE_OWM_BASE_URL` | `https://api.openweathermap.org/data/2.5` |
| `VITE_OWM_GEO_URL` | `https://api.openweathermap.org/geo/1.0` |
| `VITE_OWM_ONECALL_URL` | `https://api.openweathermap.org/data/3.0` |

## Development

- Workflow: `cd frontend && npm run dev` on port 5000
- The Vite dev server is configured with `allowedHosts: true` for the Replit proxy

## Production / Deployment

- Build: `npm run build` (installs frontend deps + runs `vite build`)
- Run: `node server.js` (Express serves `frontend/dist` on port from `process.env.PORT`)
- Deployment target: autoscale
