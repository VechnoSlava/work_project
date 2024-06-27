import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"
import { selectSlavePage } from "../model/navigationPageSlice"
import {
  selectWindow,
  toggleSecondaryWindow,
} from "../model/navigationWindowSlice"
import styles from "./navigation.module.css"
import { NavigationTabs } from "../../../entities/navigation/navigationTabs"
import { NavigationMenu } from "../../../entities/navigation/navigationMenu"
import { NavigationButtons } from "../../../entities/navigation/navigationButtons"
import { MainButtonFilter } from "../../../entities/buttonsFilters/mainButtonFilter"

export const Navigation = () => {
  const dispatch = useAppDispatch()
  const isSecondaryWindowOpen = useAppSelector(selectWindow)
  const currentSlavePage = useAppSelector(selectSlavePage)
  const newWindowRef = useRef<Window | null>(null)

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
    <nav className={styles.container}>
      <NavigationTabs />
      <NavigationMenu />
      <NavigationButtons />
      <MainButtonFilter />
    </nav>
  )
}
