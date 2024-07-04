import {
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material"

import styles from "./pagesNavigationMenu.module.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../../app/store/hooks"
import { selectPage, setPage } from "../../../model/pagesNavigationSlice"
import {
  ROUTES_PATH,
  type RoutePath,
} from "../../../../../shared/constants/routes"

export const PagesNavigationMenu = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [openMenu, setOpenMenu] = useState<HTMLElement | null>(null)
  const openedMenu = Boolean(openMenu)
  const currentMainPage = useAppSelector(selectPage)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget)
  }
  const handleMenuClose = () => {
    setOpenMenu(null)
  }
  const handleMenuItemClick = (newPage: RoutePath, index: number) => {
    dispatch(setPage(newPage))
    navigate(newPage)
    setSelectedIndex(index)
    setOpenMenu(null)
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
  return (
    <div className={styles.navigation__menu}>
      <List component="nav" aria-label="Nav bar">
        <ListItemButton
          sx={{ padding: 0, minWidth: "260px" }}
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
        sx={{
          "& .MuiPaper-root": {
            width: "200px",
            backgroundColor: "#1a4858",
            color: "rgb(255 255 255)",
          },
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
  )
}
