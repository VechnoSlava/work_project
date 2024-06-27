import { ToggleButton } from "@mui/material"
import { BsSliders } from "react-icons/bs"
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks"
import {
  selectSideMenuOpened,
  toggleSideMenu,
} from "../../../../widgets/sideMenuFilters/model/sideMenuSlice"

export const MainButtonFilter = () => {
  const dispatch = useAppDispatch()
  const sideMenuFiltersOpened = useAppSelector(selectSideMenuOpened)

  const handleOpenFilters = () => {
    dispatch(toggleSideMenu())
  }

  return (
    <>
      <ToggleButton
        value="check"
        selected={sideMenuFiltersOpened}
        title="Меню фильтров"
        onClick={handleOpenFilters}
        sx={{
          backgroundColor: "#ffffff08",
          border: "1px solid #737373",
          boxShadow:
            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
          "&:hover": {
            backgroundColor: "#0000003d",
          },
        }}
      >
        <BsSliders size={36} style={{ color: "white" }} />
      </ToggleButton>
    </>
  )
}
