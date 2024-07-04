import { BsSliders } from "react-icons/bs"
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"
import {
  selectSideMenuOpened,
  toggleSideMenu,
} from "../../../widgets/sideMenuFilters/model/sideMenuSlice"
import { ButtonMenuHead } from "../../../shared/buttons"
import styles from "./buttonSideMenuFilters.module.css"

export const ButtonSideMenuFilters = () => {
  const dispatch = useAppDispatch()
  const sideMenuFiltersOpened = useAppSelector(selectSideMenuOpened)

  const handleOpenFilters = () => {
    dispatch(toggleSideMenu())
  }

  return (
    <>
      <div className={styles.buttonContainer}>
        <ButtonMenuHead
          value="check"
          selected={sideMenuFiltersOpened}
          title="Меню фильтров"
          onClick={handleOpenFilters}
        >
          <BsSliders size="100%" />
        </ButtonMenuHead>
      </div>
    </>
  )
}
