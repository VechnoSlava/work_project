import type { FC } from "react"
import { Navigation } from "../../../entities/navigation/ui/navigation"
import styles from "./header.module.scss"
import IconLogo from "../../../shared/icons/logoIcon"

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__icon}>
          <IconLogo />
        </div>
        <Navigation />
      </div>
    </header>
  )
}
