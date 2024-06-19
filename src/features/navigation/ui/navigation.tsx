import { NavLink, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"
import { type RoutePath, ROUTES_PATH } from "../../../shared/constants/routes"
import {
  selectPage,
  selectSlavePage,
  setPage,
} from "../model/navigationPageSlice"
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
import { useEffect, useRef, useState } from "react"

export const Navigation: React.FC = () => {
  const dispatch = useAppDispatch()
  const isSecondaryWindowOpen = useAppSelector(selectWindow)
  const checkIdentificationMode = useAppSelector(selectModeIdentification)
  const checkReferenceMode = useAppSelector(selectModeReference)
  const currentMainPage = useAppSelector(selectPage)
  const currentSlavePage = useAppSelector(selectSlavePage)
  const newWindowRef = useRef<Window | null>(null)

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
    switch (currentMainPage) {
      case ROUTES_PATH.MAIN:
        return "Текущая обстановка"
      case ROUTES_PATH.HISTORY:
        return "База данных"
      default:
        return ""
    }
  }
  const getSecondaryPageLabel = () => {
    switch (currentMainPage) {
      case ROUTES_PATH.MAIN:
        return "База данных"
      case ROUTES_PATH.HISTORY:
        return "Текущая обстановка"
      default:
        return ""
    }
  }

  const optionsPath = [
    { label: "Текущая обстановка", path: ROUTES_PATH.MAIN },
    { label: "База данных", path: ROUTES_PATH.HISTORY },
  ]

  // второе окно
  useEffect(() => {
    console.log("run effect", newWindowRef.current)

    const handleUnload = () => {
      console.log("dispatch effect")
      dispatch(toggleSecondaryWindow())
    }

    const attachHandlerUnload = () => {
      if (newWindowRef.current) {
        newWindowRef.current.removeEventListener("unload", handleUnload)
        newWindowRef.current.addEventListener("unload", handleUnload)
      }
    }

    if (isSecondaryWindowOpen) {
      console.log("start create", newWindowRef.current)
      if (!newWindowRef.current || newWindowRef.current.closed) {
        console.log("create new window", newWindowRef.current)
        newWindowRef.current = window.open(
          currentSlavePage,
          "slaveWindow",
          "width=800,height=600,menubar=0,toolbar=0",
        )
        const interval = setInterval(() => {
          if (
            newWindowRef.current &&
            newWindowRef.current.document.readyState === "complete"
          ) {
            attachHandlerUnload()
            clearInterval(interval)
          }
        }, 100)
      } else {
        newWindowRef.current.location.replace(currentSlavePage)
        console.log("replace page", newWindowRef.current)

        const interval = setInterval(() => {
          if (
            newWindowRef.current &&
            newWindowRef.current.document.readyState === "complete"
          ) {
            attachHandlerUnload()
            clearInterval(interval)
          }
        }, 100)
      }
    } else if (newWindowRef.current) {
      newWindowRef.current.close()
      newWindowRef.current = null
      console.log("close window", newWindowRef.current)
    }
    return () => {
      console.log("return effect")
      if (newWindowRef.current) {
        newWindowRef.current.removeEventListener("unload", handleUnload)
      }
    }
  }, [isSecondaryWindowOpen, currentSlavePage, dispatch])

  return (
    <nav className={styles.container}>
      <div className={styles.navigation__tabs}>
        <Tabs
          value={currentMainPage}
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
          {optionsPath.map((option, index) => (
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
          checked={isSecondaryWindowOpen}
          onChange={handleToggleWindow}
          inputProps={{ "aria-label": "2-х оконный режим" }}
        />
        <ToggleSwitch
          // disabled
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
