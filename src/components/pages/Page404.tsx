import { memo } from "react"
import styles from "./Page404.module.css";


export const Page404: React.FC = memo(() => {
  return (
    <div className={styles.not_found}>
    <h3 className={styles.not_found_text}>存在しないページです</h3>
    </div>
  )
});