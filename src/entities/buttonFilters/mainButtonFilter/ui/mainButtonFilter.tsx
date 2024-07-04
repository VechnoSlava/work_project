import { ToggleButton } from "@mui/material"
import { BsSliders } from "react-icons/bs"
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks"
import {
  selectSideMenuOpened,
  toggleSideMenu,
} from "../../../../widgets/sideMenuFilters/model/sideMenuSlice"
import styles from "./mainButtonFilter.module.css"

export const MainButtonFilter = () => {
  const dispatch = useAppDispatch()
  const sideMenuFiltersOpened = useAppSelector(selectSideMenuOpened)

  const handleOpenFilters = () => {
    dispatch(toggleSideMenu())
  }

  return (
    <>
      <div className={styles.buttonContainer}>
        <ToggleButton
          value="check"
          selected={sideMenuFiltersOpened}
          title="Меню фильтров"
          onClick={handleOpenFilters}
          sx={{
            padding: "10px",
            color: "white",
            width: "60px",
            height: "60px",
            backgroundColor: "#ffffff08",
            border: "1px solid #737373",
            boxShadow:
              "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
            "&:hover": {
              backgroundColor: "#0000003d",
            },
          }}
        >
          <BsSliders size="100%" />
        </ToggleButton>
      </div>
    </>
  )
}
