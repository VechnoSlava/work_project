import { MainMap } from '../../../widgets/mainMap'
import { SplitFrame } from '../../../entities/splitFrame'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { useEffect, useState } from 'react'
import { RadarsTable } from '../../../widgets/radarsTable'

export const HistoryPage = () => {
	console.log('RENDER HISTORY_PAGE')

	const secondWindowOpened = useAppSelector(selectModeSecondWindow)
	const [key, setKey] = useState(201)

	useEffect(() => {
		secondWindowOpened ? setKey(200) : setKey(201)
	}, [secondWindowOpened])

	return (
		<SplitFrame frameDirection="horizontal" key={key}>
			{!secondWindowOpened && <MainMap key={1} />}
			<RadarsTable key={6} />
		</SplitFrame>
	)

	// return (
	// 	<SplitFrame frameDirection="vertical" key={key}>
	// 		<SplitFrame frameDirection="horizontal" key={202}>
	// 			{!secondWindowOpened && <MainMap key={1} />}
	// 			<CurrentTargetsTable key={3} />
	// 		</SplitFrame>
	// 		<SplitFrame frameDirection="horizontal" key={203}>
	// 			<SplitFrame frameDirection="vertical" key={204}>
	// 				<CurrentTargetsTable key={4} />
	// 				<SpectrumTargetChart key={5} />
	// 			</SplitFrame>
	// 			<CurrentTargetsTable key={6} />
	// 		</SplitFrame>
	// 	</SplitFrame>
	// )
}
