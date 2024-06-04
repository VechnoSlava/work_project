import type { FC } from "react"
import { MainMap } from "../../../widgets/mainMap"
import { CommonTargetsTable } from "../../../widgets/commonTargetsTable"
import { SpectrumTargetChart } from "../../../widgets/spectrumTargetChart"

export const MainPage: FC = () => {
  console.log("render main page")

  return (
    <div>
      <h1>MainPage</h1>
      <MainMap />
      <CommonTargetsTable />
      <SpectrumTargetChart />
    </div>
  )
}
