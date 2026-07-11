import { Alert, Button, Space, Typography } from "antd";
import { AimOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../../components/SearchBar/SearchBar.jsx";
import { WeatherCard } from "../../components/WeatherCard/WeatherCard.jsx";
import { useFavorites } from "../../hooks/useFavorites.js";
import { useGeolocation } from "../../hooks/useGeolocation.js";
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
      if (geo.name) navigate(`/city/${encodeURIComponent(geo.name)}`);
    } catch (error) {
      setErrorMessage(
        error?.message ?? "Не удалось определить местоположение",
      );
    }
  };

  const handleSelectCity = (cityValue) => {
    if (!cityValue?.name) return;
    dispatch({ type: "setCity", value: cityValue });
    navigate(`/city/${encodeURIComponent(cityValue.name)}`);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <Typography.Text className={styles.kicker}>
            Прогноз рядом и по всему миру
          </Typography.Text>
          <Typography.Title level={1} className={styles.title}>
            Погода без лишнего шума
          </Typography.Title>
          <Typography.Paragraph className={styles.subtitle}>
            Найдите город, сохраните избранное и быстро проверяйте температуру,
            ветер, осадки и качество воздуха.
          </Typography.Paragraph>
        </div>

        <div className={styles.searchPanel}>
          <SearchBar placeholder="Введите город" />
          <Button
            type="primary"
            size="large"
            icon={<AimOutlined />}
            loading={isLoading}
            onClick={handleMyLocation}
          >
            Моё местоположение
          </Button>
        </div>
      </section>

      <Space orientation="vertical" size={16} className={styles.stack}>
        {errorMessage ? (
          <Alert type="error" showIcon message={errorMessage} />
        ) : null}

        {favorites.length > 0 ? (
          <section className={styles.favoritesBlock}>
            <div className={styles.sectionHeader}>
              <Typography.Title level={3} className={styles.sectionTitle}>
                Избранные города
              </Typography.Title>
              <Typography.Text className={styles.sectionHint}>
                Быстрый переход к сохранённым прогнозам
              </Typography.Text>
            </div>
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
                  onClick={() => handleSelectCity(fav)}
                >
                  <span>{fav.name}</span>
                  {fav.country ? <small>{fav.country}</small> : null}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {city ? <WeatherCard /> : null}
      </Space>
    </div>
  );
};
