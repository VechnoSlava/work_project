import type { FC } from "react"
import { MainMap } from "../../../widgets/mainMap"
import { CommonTargetsTable } from "../../../widgets/commonTargetsTable"
import { SpectrumTargetChart } from "../../../widgets/spectrumTargetChart"

export const HistoryPage: FC = () => {
  return (
    <div>
      <h1>HistoryPage</h1>
      <MainMap />
      <CommonTargetsTable />
      <SpectrumTargetChart />
      <SpectrumTargetChart />
    </div>
  )
}
