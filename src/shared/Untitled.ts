// import { useAppSelector } from "../store/hooks"
// import { selectPage } from "../../features/navigation/model/navigationPageSlice"
// import { selectWindow } from "../../features/navigation/model/navigationWindowSlice"
// import { useCallback, useEffect } from "react"

// const currentPage = useAppSelector(selectPage)
// const isSecondaryWindow = useAppSelector(selectWindow)

// let slaveWindow: Window | null = null

// const pathSelector = useCallback(() => {
//   switch (currentPage) {
//     case ROUTES_PATH.MAIN:
//       return ROUTES_PATH.SLAVEMAIN
//     case ROUTES_PATH.HISTORY:
//       return ROUTES_PATH.SLAVEHISTORY
//     default:
//       return ROUTES_PATH.SLAVEMAIN
//   }
// }, [currentPage])

// useEffect(() => {
//   if (isSecondaryWindow) {
//     const path = pathSelector()
//     slaveWindow = window.open(
//       path,
//       "slaveWindow",
//       "location=0,width=300,height=300,menubar=0,toolbar=0",
//     )
//   } else if (slaveWindow) {
//     slaveWindow.close()
//   }

//   return () => {
//     if (slaveWindow) {
//       slaveWindow?.close()
//     }
//   }
// }, [isSecondaryWindow, pathSelector])
