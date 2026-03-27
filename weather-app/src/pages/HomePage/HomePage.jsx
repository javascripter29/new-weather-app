import { Button, Space, Typography, Alert } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../../components/SearchBar/SearchBar.jsx";
import { WeatherCard } from "../../components/WeatherCard/WeatherCard.jsx";
import { useGeolocation } from "../../hooks/useGeolocation.js";
import { useFavorites } from "../../hooks/useFavorites.js";
import { useWeatherStore } from "../../store/weatherStore.js";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  const { city, dispatch } = useWeatherStore();
  const { favorites } = useFavorites();
  const { isLoading, getMyLocation } = useGeolocation();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const handleMyLocation = async () => {
    setErrorMessage("");
    try {
      const geo = await getMyLocation();
      if (!geo) return;
      dispatch({ type: "setCity", value: geo });
      if (geo.name) {
        navigate(`/city/${encodeURIComponent(geo.name)}`);
      }
    } catch (error) {
      setErrorMessage(error?.message ?? "Не удалось определить местоположение");
    }
  };

  const handleSelectCity = (cityValue) => {
    if (!cityValue || !cityValue.name) return;
    dispatch({ type: "setCity", value: cityValue });
    navigate(`/city/${encodeURIComponent(cityValue.name)}`);
  };

  return (
    <div className={styles.page}>
      <Typography.Title level={2} className={styles.title}>
        Погода
      </Typography.Title>

      <Space orientation="vertical" size={12} style={{ width: "100%" }}>
        <SearchBar />

        <div className={styles.geoRow}>
          <Button
            aria-label="Моё местоположение"
            loading={isLoading}
            onClick={handleMyLocation}
          >
            Моё местоположение
          </Button>
        </div>

        {errorMessage ? (
          <Alert type="error" showIcon message={errorMessage} />
        ) : null}

        {favorites.length > 0 ? (
          <div>
            <Typography.Text type="secondary">Избранные</Typography.Text>
            <div
              className={styles.favoritesRow}
              role="list"
              aria-label="Список избранных городов"
            >
              {favorites.map((fav) => (
                <button
                  key={`${fav.lat},${fav.lon}`}
                  type="button"
                  className={styles.favoriteBtn}
                  aria-label={`Загрузить город ${fav.name}`}
                  tabIndex={0}
                  onClick={() => handleSelectCity(fav)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleSelectCity(fav);
                  }}
                >
                  {fav.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {city ? <WeatherCard /> : null}
      </Space>
    </div>
  );
};
