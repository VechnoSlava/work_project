import styles from "./header.module.css"
import { IconLogo } from "../../../shared/icons"
import {
  PagesNavigationMenu,
  PagesNavigationTabs,
} from "../../../features/pagesNavigation"
import { ControlModesPanel } from "../../../features/controlModesPanel"
import { ButtonConnectToServer } from "../../../features/buttonConnectToServer"
import { ButtonSideMenuFilters } from "../../../features/buttonSideMenuFilters"

export const Header = () => {
  console.log("HEADER")

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__icon}>
          <IconLogo />
        </div>
        <div className={styles.header__navigation}>
          <PagesNavigationTabs />
          <PagesNavigationMenu />
        </div>
        <div className={styles.header__controls}>
          <ControlModesPanel />
        </div>
        <div className={styles.header__buttons}>
          <ButtonConnectToServer />
          <ButtonSideMenuFilters />
        </div>
      </div>
    </header>
  )
}
