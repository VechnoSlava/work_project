import { MainMap } from '../../../widgets/mainMap'
import { CommonTargetsTable } from '../../../widgets/commonTargetsTable'
import { SpectrumTargetChart } from '../../../widgets/spectrumTargetChart'
import { SplitFrame } from '../../../entities/splitFrame'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { useEffect, useState } from 'react'

export const HistoryPage = () => {
	console.log('render history page')
	const secondWindowOpened = useAppSelector(selectModeSecondWindow)
	const [key, setKey] = useState(0)
	useEffect(() => {
		secondWindowOpened ? setKey(200) : setKey(201)
	})
	return (
		<SplitFrame frameDirection="vertical" key={key}>
			<SplitFrame frameDirection="horizontal" key={202}>
				{!secondWindowOpened && <MainMap key={1} />}
				<CommonTargetsTable key={3} />
			</SplitFrame>
			<SplitFrame frameDirection="horizontal" key={203}>
				<SplitFrame frameDirection="vertical" key={204}>
					<CommonTargetsTable key={4} />
					<SpectrumTargetChart key={5} />
				</SplitFrame>
				<CommonTargetsTable key={6} />
			</SplitFrame>
		</SplitFrame>
	)
}
