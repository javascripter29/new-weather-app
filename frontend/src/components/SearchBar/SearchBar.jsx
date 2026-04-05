import PropTypes from "prop-types";
import { AutoComplete, Input, Alert } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCitiesByQuery } from "../../api/weatherApi.js";
import { useWeatherStore } from "../../store/weatherStore.js";

const SEARCH_DEBOUNCE_MS = 400;

export const SearchBar = ({ placeholder }) => {
  const navigate = useNavigate();
  const { dispatch } = useWeatherStore();

  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const timerRef = useRef(null);

  const normalizedOptions = useMemo(() => {
    if (options.length > 0) return options;
    return [];
  }, [options]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const fetchCities = async (q) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setOptions([]);
      return;
    }

    setErrorMessage("");

    try {
      const data = await getCitiesByQuery(trimmed, 5);
      if (!data || data.length === 0) {
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
            item.state ? item.state : null,
            item.country ? item.country : null,
          ].filter(Boolean);

          return {
            value: item.name,
            label: cityLabelParts.join(", "),
            city: item,
          };
        }),
      );
    } catch (error) {
      setErrorMessage(error?.message ?? "Не удалось загрузить данные");
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

  const handleSelect = (nextValue, option) => {
    const city = option?.city;
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

    navigate(`/city/${encodeURIComponent(city.name)}`);
  };

  return (
    <div>
      {errorMessage ? (
        <Alert
          type="error"
          showIcon
          title={errorMessage}
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
        <Input aria-label="Поиск города" aria-describedby="city-search-help" />
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
