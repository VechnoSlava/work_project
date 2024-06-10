import { NavLink, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"
import { type RoutePath, ROUTES_PATH } from "../../../shared/constants/routes"
import { selectPage, setPage } from "../model/navigationPageSlice"
import styles from "./navigation.module.css"
import {
  selectModeIdentification,
  selectModeReference,
  selectWindow,
  toggleIdentificationMode,
  toggleReferenceMode,
  toggleSecondaryWindow,
} from "../model/navigationWindowSlice"
import { ToggleSwitch } from "../../../entities/switches/toggleSwitch"
import {
  Tabs,
  Tab,
  Menu,
  MenuItem,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import { useState } from "react"

export const Navigation: React.FC = () => {
  const dispatch = useAppDispatch()
  const checkOpenedWindow = useAppSelector(selectWindow)
  const checkIdentificationMode = useAppSelector(selectModeIdentification)
  const checkReferenceMode = useAppSelector(selectModeReference)
  const currentPage = useAppSelector(selectPage)

  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const openedMenu = Boolean(openMenu)
  const navigate = useNavigate()

  const handleToggleWindow = () => {
    dispatch(toggleSecondaryWindow())
  }
  const handleModeIdentification = () => {
    dispatch(toggleIdentificationMode())
  }

  const handleModeReference = () => {
    dispatch(toggleReferenceMode())
  }

  const handlePageChange = (
    event: React.SyntheticEvent | null,
    newPage: RoutePath,
  ) => {
    dispatch(setPage(newPage))
    if (event) {
      navigate(newPage)
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget)
  }

  const handleMenuClose = () => {
    setOpenMenu(null)
  }

  const handleMenuItemClick = (newPage: RoutePath, index: number) => {
    handlePageChange(null, newPage)
    setSelectedIndex(index)
    navigate(newPage)
    handleMenuClose()
  }

  const getCurrentPageLabel = () => {
    switch (currentPage) {
      case ROUTES_PATH.MAIN:
        return "Текущая обстановка"
      case ROUTES_PATH.HISTORY:
        return "База данных"
      default:
        return ""
    }
  }
  const getSecondaryPageLabel = () => {
    switch (currentPage) {
      case ROUTES_PATH.MAIN:
        return "База данных"
      case ROUTES_PATH.HISTORY:
        return "Текущая обстановка"
      default:
        return ""
    }
  }

  const options = [
    { label: "Текущая обстановка", path: ROUTES_PATH.MAIN },
    { label: "База данных", path: ROUTES_PATH.HISTORY },
  ]

  return (
    <nav className={styles.container}>
      <div className={styles.navigation__tabs}>
        <Tabs
          value={currentPage}
          onChange={handlePageChange}
          aria-label="navigation tabs"
          textColor="inherit"
          TabIndicatorProps={{
            sx: {
              backgroundColor: "#fff",
              height: 3, // Толщина линии подчеркивания
              bottom: 0, // Полоса по нижнему краю блока
            },
          }}
          sx={{
            height: "100%",
            "& .MuiTab-root": {
              height: "100%",
              transition: "color 0.3s",
              "&:hover": {
                backgroundColor: "#00000052",
              },
            },
            "& .MuiTabs-flexContainer": {
              height: "100%",
            },
          }}
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

      <div className={styles.navigation__menu}>
        <List component="nav" aria-label="Nav bar">
          <ListItemButton
            id="lock-button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-expanded={openedMenu}
            onClick={handleMenuOpen}
          >
            <ListItemText
              primary={getCurrentPageLabel()}
              secondary={getSecondaryPageLabel()}
              primaryTypographyProps={{
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
              secondaryTypographyProps={{
                color: "gray",
              }}
            />
          </ListItemButton>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={openMenu}
          open={openedMenu}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "lock-button",
            role: "listbox",
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option.path}
              disabled={index === selectedIndex}
              selected={index === selectedIndex}
              onClick={() => handleMenuItemClick(option.path, index)}
              sx={{
                "&:hover": {
                  backgroundColor: "#112d492a",
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
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
          checked={checkIdentificationMode}
          onChange={handleModeIdentification}
          inputProps={{ "aria-label": "Режим идентификации" }}
        />
      </div>
      <div className={styles.navigation__buttons}>
        <ToggleSwitch
          nameSwitch="Режим эталонов"
          checked={checkReferenceMode}
          onChange={handleModeReference}
          inputProps={{ "aria-label": "Режим эталонов" }}
        />
      </div>
    </nav>
  )
}
