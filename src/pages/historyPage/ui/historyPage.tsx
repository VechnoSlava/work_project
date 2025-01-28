import styles from './historyPage.module.css'
import { MainMap } from '../../../widgets/mainMap'
import { SplitFrame } from '../../../entities/splitFrame'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { useEffect, useState } from 'react'
import { RadarsTable } from '../../../widgets/radarsTable'
import { CurrentTargetsTable } from '../../../widgets/currentTargetsTable'

export const HistoryPage = () => {
	console.log('RENDER HISTORY_PAGE')

	const secondWindowOpened = useAppSelector(selectModeSecondWindow)
	const [key, setKey] = useState(200)

	useEffect(() => {
		secondWindowOpened ? setKey(201) : setKey(200)
	}, [secondWindowOpened])

	return (
		<div className={styles.container}>
			<SplitFrame frameDirection="vertical" key={key}>
				<SplitFrame frameDirection="horizontal" key={202}>
					{secondWindowOpened ? null : <MainMap key={1} />}
					<RadarsTable key={2} />
					{/* <SpectrumPanoramaTest key={3} /> */}
				</SplitFrame>
				<SplitFrame frameDirection="horizontal" key={203}>
					<SplitFrame frameDirection="vertical" key={204}>
						<div key={4} />
						<RadarsTable key={5} />
					</SplitFrame>
					{secondWindowOpened ? null : <CurrentTargetsTable key={6} />}
				</SplitFrame>
			</SplitFrame>
		</div>
	)
}
