import { Alert, Space, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getCitiesByQuery } from "../../api/weatherApi.js";
import { SearchBar } from "../../components/SearchBar/SearchBar.jsx";
import { WeatherCard } from "../../components/WeatherCard/WeatherCard.jsx";
import { useWeatherStore } from "../../store/weatherStore.js";
import styles from "./CityPage.module.css";

const isSameCityName = (left, right) =>
  String(left ?? "").trim().toLowerCase() ===
  String(right ?? "").trim().toLowerCase();

export const CityPage = () => {
  const { name } = useParams();
  const { city, dispatch } = useWeatherStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const decodedName = useMemo(() => decodeURIComponent(name ?? ""), [name]);

  useEffect(() => {
    setErrorMessage("");
    if (!decodedName) return;
    if (isSameCityName(city?.name, decodedName)) return;

    const resolveByName = async () => {
      setIsResolving(true);
      try {
        const results = await getCitiesByQuery(decodedName, 8);
        const exact =
          results?.find((item) => isSameCityName(item.name, decodedName)) ??
          results?.[0];

        if (!exact) {
          setErrorMessage("Город не найден");
          return;
        }

        dispatch({
          type: "setCity",
          value: {
            name: exact.name,
            state: exact.state,
            country: exact.country,
            lat: exact.lat,
            lon: exact.lon,
          },
        });
      } catch (error) {
        setErrorMessage(error?.message ?? "Не удалось загрузить данные");
      } finally {
        setIsResolving(false);
      }
    };

    resolveByName();
  }, [city?.name, decodedName, dispatch]);

  return (
    <div className={styles.page}>
      <Space orientation="vertical" size={14} style={{ width: "100%" }}>
        <div className={styles.headerBlock}>
          <Typography.Text className={styles.kicker}>Прогноз города</Typography.Text>
          <Typography.Title level={1} className={styles.title}>
            {city?.name ?? decodedName}
          </Typography.Title>
          <SearchBar placeholder="Найти другой город" />
        </div>

        {errorMessage ? (
          <Alert type="error" showIcon message={errorMessage} />
        ) : null}
        {isResolving ? (
          <Typography.Text type="secondary">Загружаем город...</Typography.Text>
        ) : null}
        {city ? <WeatherCard /> : null}
      </Space>
    </div>
  );
};
