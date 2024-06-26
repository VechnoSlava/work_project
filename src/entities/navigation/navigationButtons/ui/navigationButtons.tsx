import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks"
import {
  selectModeIdentification,
  selectModeReference,
  selectWindow,
  toggleIdentificationMode,
  toggleReferenceMode,
  toggleSecondaryWindow,
} from "../../../../features/navigation/model/navigationWindowSlice"
import styles from "./navigationButtons.module.css"
import { selectPage } from "../../../../features/navigation/model/navigationPageSlice"
import {
  ROUTES_PATH,
  type RoutePath,
} from "../../../../shared/constants/routes"
import { ToggleSwitch } from "../../../switches/toggleSwitch"

export const NavigationButtons = () => {
  const isSecondaryWindowOpen = useAppSelector(selectWindow)
  const checkIdentificationMode = useAppSelector(selectModeIdentification)
  const checkReferenceMode = useAppSelector(selectModeReference)
  const currentMainPage = useAppSelector(selectPage)
  const dispatch = useAppDispatch()

  const handleToggleWindow = () => {
    dispatch(toggleSecondaryWindow())
  }

  const handleModeIdentification = () => {
    dispatch(toggleIdentificationMode())
  }

  const handleModeReference = () => {
    dispatch(toggleReferenceMode())
  }

  const handleDisabledModeIDentification = (currentMainPage: RoutePath) => {
    return currentMainPage === ROUTES_PATH.MAIN ? true : false
  }

  return (
    <>
      <div className={styles.navigation__buttons}>
        <ToggleSwitch
          nameSwitch="2-х оконный режим"
          checked={isSecondaryWindowOpen}
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
          disabled={handleDisabledModeIDentification(currentMainPage)}
          nameSwitch="Режим эталонов"
          checked={checkReferenceMode}
          onChange={handleModeReference}
          inputProps={{ "aria-label": "Режим эталонов" }}
        />
        {/* <ToggleSwitch
          disabled={handleDisabledModeIDentification(currentMainPage)}
          nameSwitch="Режим эталонов"
          checked={checkReferenceMode}
          onChange={handleModeReference}
          inputProps={{ "aria-label": "Режим эталонов" }}
        /> */}
      </div>
    </>
  )
}
