import { BiWifi, BiWifiOff } from "react-icons/bi"
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"
import { ButtonMenuHead } from "../../../shared/buttons"
import {
  selectModeIdentification,
  toggleIdentificationMode,
} from "../../controlModesPanel/model/controlModesSlice"
import styles from "./buttonConnectToServer.module.css"

export const ButtonConnectToServer = () => {
  const dispatch = useAppDispatch()
  const isIdentification = useAppSelector(selectModeIdentification)

  const handleOpenFilters = () => {
    dispatch(toggleIdentificationMode())
  }

  return (
    <>
      <div className={styles.buttonContainer}>
        <ButtonMenuHead
          value="check"
          selected={isIdentification}
          title="Меню фильтров"
          onClick={handleOpenFilters}
        >
          {isIdentification ? (
            <BiWifi size="100%" style={{ color: "#04b355ff" }} />
          ) : (
            <BiWifiOff size="100%" />
          )}
        </ButtonMenuHead>
      </div>
    </>
  )
}
