import { memo } from "react"
import Header from "../organisms/layout/Header";
import { Outlet } from "react-router-dom";
import styles from "../../features/core/Core.module.css";

export const HeaderLayout: React.FC = memo(() => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <Outlet />
      </div>
    </>
  );
});