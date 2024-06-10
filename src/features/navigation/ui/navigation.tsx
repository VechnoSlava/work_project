import { NavLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"
import { type RoutePath, ROUTES_PATH } from "../../../shared/constants/routes"
import { selectPage, setPage } from "../model/navigationPageSlice"
import styles from "./navigation.module.css"
import {
  selectWindow,
  toggleSecondaryWindow,
} from "../model/navigationWindowSlice"
import { ToggleSwitch } from "../../../entities/switches/toggleSwitch"
import { Tabs, Tab, IconButton, Menu, MenuItem } from "@mui/material"
import { RiLineHeight } from "react-icons/ri"
import { useState } from "react"

export const Navigation: React.FC = () => {
  const dispatch = useAppDispatch()
  const checkOpenedWindow = useAppSelector(selectWindow)
  const currentPage = useAppSelector(selectPage)
  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null)
  const openedMenu = Boolean(openMenu)

  const handleToggleWindow = () => {
    dispatch(toggleSecondaryWindow())
  }

  const handlePageChange = (
    event: React.SyntheticEvent | null,
    newPage: RoutePath,
  ) => {
    dispatch(setPage(newPage))
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget)
  }

  const handleMenuClose = () => {
    setOpenMenu(null)
  }

  return (
    <nav className={styles.container}>
      <div className={styles.navigation__tabs}>
        <Tabs
          value={currentPage}
          onChange={handlePageChange}
          aria-label="navigation tabs"
          textColor="inherit"
        >
          <Tab
            label="Текущая обстановка"
            value={ROUTES_PATH.MAIN}
            component={NavLink}
            to={ROUTES_PATH.MAIN}
          />
          <Tab
            label="База данных"
            value={ROUTES_PATH.HISTORY}
            component={NavLink}
            to={ROUTES_PATH.HISTORY}
          />
        </Tabs>
      </div>
      <div className={styles.navigation__buttons}>
        <ToggleSwitch
          nameSwitch="2-х оконный режим"
          checked={checkOpenedWindow}
          onChange={handleToggleWindow}
          inputProps={{ "aria-label": "2-х оконный режим" }}
        />
        <ToggleSwitch
          nameSwitch="Режим идентификации"
          checked={checkOpenedWindow}
          onChange={handleToggleWindow}
          inputProps={{ "aria-label": "Режим идентификации" }}
        />
      </div>
      <IconButton
        classes={styles.menuButton}
        aria-label="morePages"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
      >
        <RiLineHeight />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={openMenu}
        open={openedMenu}
        onClose={handleMenuClose}
        // MenuListProps={{
        //   style: {
        //     maxHeight: 48 * 4.5,
        //     width: "20ch",
        //   },
        // }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose()
            handlePageChange(null, ROUTES_PATH.MAIN)
          }}
        >
          Текущая обстановка
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            handlePageChange(null, ROUTES_PATH.HISTORY)
          }}
        >
          База данных
        </MenuItem>
      </Menu>
    </nav>
  )
}
