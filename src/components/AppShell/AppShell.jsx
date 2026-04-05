import { Layout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppHeader } from "../AppHeader/AppHeader.jsx";
import { AppFooter } from "../AppFooter/AppFooter.jsx";
import { OfflineBanner } from "../OfflineBanner/OfflineBanner.jsx";
import { CityPage } from "../../pages/CityPage/CityPage.jsx";
import { HomePage } from "../../pages/HomePage/HomePage.jsx";
import styles from "./AppShell.module.css";

export const AppShell = () => {
  return (
    <BrowserRouter>
      <Layout className={styles.shell}>
        <AppHeader />
        <Layout.Content className={styles.content}>
          <OfflineBanner />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/city/:name" element={<CityPage />} />
          </Routes>
        </Layout.Content>
        <AppFooter />
      </Layout>
    </BrowserRouter>
  );
};
