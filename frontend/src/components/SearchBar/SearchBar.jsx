import PropTypes from "prop-types";
import { Alert, AutoComplete, Input } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCitiesByQuery } from "../../api/weatherApi.js";
import { useWeatherStore } from "../../store/weatherStore.js";

const SEARCH_DEBOUNCE_MS = 350;

const getCityOptionValue = (city) => {
  const parts = [
    city.name,
    city.state,
    city.country,
    Number(city.lat).toFixed(4),
    Number(city.lon).toFixed(4),
  ].filter(Boolean);

  return parts.join("|");
};

export const SearchBar = ({ placeholder }) => {
  const navigate = useNavigate();
  const { dispatch } = useWeatherStore();

  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const timerRef = useRef(null);

  const normalizedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const selectCity = (city) => {
    if (!city) return;

    dispatch({
      type: "setCity",
      value: {
        name: city.name,
        state: city.state,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
      },
    });

    setValue("");
    setOptions([]);
    navigate(`/city/${encodeURIComponent(city.name)}`);
  };

  const fetchCities = async (q) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setOptions([]);
      return;
    }

    setErrorMessage("");

    try {
      const data = await getCitiesByQuery(trimmed, 8);
      if (!data?.length) {
        setOptions([
          {
            value: "not-found",
            label: "Город не найден",
            disabled: true,
          },
        ]);
        return;
      }

      setOptions(
        data.map((item) => {
          const cityLabelParts = [
            item.name,
            item.state || null,
            item.country || null,
          ].filter(Boolean);

          return {
            value: getCityOptionValue(item),
            label: cityLabelParts.join(", "),
            city: item,
          };
        }),
      );
    } catch (error) {
      setErrorMessage(
        error?.message ?? "Не удалось загрузить варианты городов",
      );
      setOptions([]);
    }
  };

  const handleSearch = (nextValue) => {
    setValue(nextValue);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      fetchCities(nextValue);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleSelect = (_nextValue, option) => {
    selectCity(option?.city);
  };

  const handleInputKeyDown = (event) => {
    if (event.key !== "Enter") return;

    const firstCity = normalizedOptions.find((option) => !option.disabled)
      ?.city;
    if (!firstCity) return;

    event.preventDefault();
    selectCity(firstCity);
  };

  return (
    <div>
      {errorMessage ? (
        <Alert
          type="error"
          showIcon
          message={errorMessage}
          style={{ marginBottom: 12 }}
        />
      ) : null}
      <AutoComplete
        options={normalizedOptions}
        value={value}
        onSearch={handleSearch}
        onSelect={handleSelect}
        placeholder={placeholder}
        allowClear
        style={{ width: "100%" }}
      >
        <Input
          aria-label="Поиск города"
          aria-describedby="city-search-help"
          onKeyDown={handleInputKeyDown}
        />
      </AutoComplete>
      <div id="city-search-help" style={{ display: "none" }}>
        Введите название города, чтобы увидеть варианты поиска
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: "Поиск города",
};
