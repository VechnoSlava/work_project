import { useAppSelector, useAppDispatch } from "../../../app/store/hooks"
import { type RoutePath, ROUTES_PATH } from "../../../shared/constants/routes"
import {
  selectWindow,
  selectModeIdentification,
  selectModeReference,
  toggleSecondaryWindow,
  toggleIdentificationMode,
  toggleReferenceMode,
} from "../model/controlModesSlice"
import {
  selectPage,
  selectSlavePage,
} from "../../pagesNavigation/model/pagesNavigationSlice"
import styles from "./controlModesPanel.module.css"
import { useEffect, useRef } from "react"
import { ToggleSwitch } from "../../../entities/toggleSwitch"

export const ControlModesPanel = () => {
  console.log("ControlPanel")

  const dispatch = useAppDispatch()
  const isSecondaryWindowOpen = useAppSelector(selectWindow)
  const isIdentificationMode = useAppSelector(selectModeIdentification)
  const isReferenceMode = useAppSelector(selectModeReference)
  const currentMainPage = useAppSelector(selectPage)
  const currentSlavePage = useAppSelector(selectSlavePage)
  const newWindowRef = useRef<Window | null>(null)

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

  // второе окно
  useEffect(() => {
    const handleUnload = () => {
      console.log("dispatch effect")
      dispatch(toggleSecondaryWindow())
    }
    const attachHandlerUnload = (currentWin: Window) => {
      currentWin.removeEventListener("unload", handleUnload)
      currentWin.addEventListener("unload", handleUnload)
    }

    if (isSecondaryWindowOpen) {
      if (!newWindowRef.current || newWindowRef.current.closed) {
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
            attachHandlerUnload(newWindowRef.current)
            clearInterval(interval)
          }
        }, 100)
      } else {
        newWindowRef.current.location.replace(currentSlavePage)
        const interval = setInterval(() => {
          if (
            newWindowRef.current &&
            newWindowRef.current.document.readyState === "complete"
          ) {
            attachHandlerUnload(newWindowRef.current)
            clearInterval(interval)
          }
        }, 100)
      }
    } else if (newWindowRef.current) {
      newWindowRef.current.close()
      newWindowRef.current = null
    }
    return () => {
      if (newWindowRef.current) {
        newWindowRef.current.removeEventListener("unload", handleUnload)
      }
    }
  }, [isSecondaryWindowOpen, currentSlavePage, dispatch])

  return (
    <div className={styles.controlPanel}>
      <div className={styles.controlPanel__column}>
        <ToggleSwitch
          nameSwitch="2-х оконный режим"
          checked={isSecondaryWindowOpen}
          onChange={handleToggleWindow}
          inputProps={{ "aria-label": "2-х оконный режим" }}
        />
        <ToggleSwitch
          nameSwitch="Режим идентификации"
          checked={isIdentificationMode}
          onChange={handleModeIdentification}
          inputProps={{ "aria-label": "2-х оконный режим" }}
        />
      </div>

      <div className={styles.controlPanel__column}>
        <ToggleSwitch
          nameSwitch="Режим эталонов"
          checked={isReferenceMode}
          onChange={handleModeReference}
          disabled={handleDisabledModeIDentification(currentMainPage)}
          inputProps={{ "aria-label": "2-х оконный режим" }}
        />
      </div>
    </div>
  )
}
