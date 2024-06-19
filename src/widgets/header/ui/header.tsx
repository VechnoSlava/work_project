import styles from "./header.module.css"
import { Button } from "@mui/material"
import { Navigation } from "../../../features/navigation/ui/navigation"
import { IconLogo } from "../../../shared/icons"

export const Header = () => {
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
          <Button onClick={() => console.log("Click")} variant="contained">
            Play
          </Button>
        </div>
      </div>
    </header>
  )
}
