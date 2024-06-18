import { type FC } from "react"
import { MainMap } from "../../../widgets/mainMap"
import { CommonTargetsTable } from "../../../widgets/commonTargetsTable"
import { SpectrumTargetChart } from "../../../widgets/spectrumTargetChart"
import styles from "./mainPage.module.css"

export const MainPage: FC = () => {
  console.log("render main page")

  return (
    <div className={styles.container}>
      <h1>MainPage</h1>
      <MainMap />
      <CommonTargetsTable />
      <SpectrumTargetChart />
    </div>
  )
}
