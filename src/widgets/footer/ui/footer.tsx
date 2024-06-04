import type { FC } from "react"
import styles from "./footer.module.css"

export const Footer: FC = () => {
  console.log("footer render")

  return (
    <footer className={styles.container}>
      <p>Данные сети</p>
    </footer>
  )
}
