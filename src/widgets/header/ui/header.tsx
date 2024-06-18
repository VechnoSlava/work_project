import styles from "./header.module.css"
import type { FC } from "react"
import { Button } from "@mui/material"
import { Navigation } from "../../../features/navigation/ui/navigation"
import { IconLogo } from "../../../shared/icons"

export const Header: FC = () => {
  console.log("HEADER")

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__icon}>
          <IconLogo />
        </div>
        <div className={styles.header__navigation}>
          <Navigation />
        </div>
        <div className={styles.header__buttons}>
          <Button variant="contained">Play</Button>
        </div>
      </div>
    </header>
  )
}
