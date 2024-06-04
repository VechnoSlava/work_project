import type { FC } from "react"
import { MainMap } from "../../../widgets/mainMap"
import { CommonTargetsTable } from "../../../widgets/commonTargetsTable"
import { SpectrumTargetChart } from "../../../widgets/spectrumTargetChart"

export const SlaveHistoryPage: FC = () => {
  return (
    <div>
      <h1>SlaveHistoryPage</h1>
      <MainMap />
      <CommonTargetsTable />
      <SpectrumTargetChart />
    </div>
  )
}
