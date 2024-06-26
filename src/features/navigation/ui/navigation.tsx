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

export const Navigation = () => {
  console.log("render NAV")

  const dispatch = useAppDispatch()
  const isSecondaryWindowOpen = useAppSelector(selectWindow)
  const currentSlavePage = useAppSelector(selectSlavePage)
  const newWindowRef = useRef<Window | null>(null)

  // второе окно
  useEffect(() => {
    console.log("run effect", newWindowRef.current)

    const handleUnload = () => {
      console.log("dispatch effect")
      dispatch(toggleSecondaryWindow())
    }

    const attachHandlerUnload = (currentWin: Window) => {
      currentWin.removeEventListener("unload", handleUnload)
      currentWin.addEventListener("unload", handleUnload)
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
            attachHandlerUnload(newWindowRef.current)
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
            attachHandlerUnload(newWindowRef.current)
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
      <NavigationTabs />
      <NavigationMenu />
      <NavigationButtons />
    </nav>
  )
}
