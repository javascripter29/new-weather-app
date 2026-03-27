import { Layout, Typography } from "antd";
import styles from "./AppFooter.module.css";

export const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Layout.Footer className={styles.footer}>
      <div className={styles.inner}>
        <Typography.Text className={styles.copyright}>
          © {currentYear} Weather App. Все права защищены.
        </Typography.Text>
      </div>
    </Layout.Footer>
  );
};
