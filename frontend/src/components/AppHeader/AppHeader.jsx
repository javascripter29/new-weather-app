import { Layout, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle.jsx";
import { UnitsToggle } from "../UnitsToggle/UnitsToggle.jsx";
import styles from "./AppHeader.module.css";

export const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <Layout.Header className={styles.header}>
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.logo}
          onClick={handleLogoClick}
          aria-label="Перейти на главную страницу"
        >
          <Typography.Text className={styles.brand} aria-label="Weather App">
            Weather
          </Typography.Text>
        </button>
        <Space size={8}>
          <UnitsToggle />
          <ThemeToggle />
        </Space>
      </div>
    </Layout.Header>
  );
};
