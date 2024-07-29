import styles from './mainPage.module.css'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { CommonTargetsTable } from '../../../widgets/commonTargetsTable'
import { SpectrumTargetChart } from '../../../widgets/spectrumTargetChart'
import { SplitFrame } from '../../../entities/splitFrame'
import { MainMap } from '../../../widgets/mainMap'
import { useState, useEffect } from 'react'

export const MainPage = () => {
	const secondWindowOpened = useAppSelector(selectModeSecondWindow)
	const [key, setKey] = useState(100)
	const [key2, setKey2] = useState(200)

	console.log(key, key2)

	useEffect(() => {
		secondWindowOpened ? setKey(101) : setKey(100)
		secondWindowOpened ? setKey2(201) : setKey2(200)
	}, [secondWindowOpened])

	return (
		<div className={styles.container}>
			<SplitFrame
				frameDirection="vertical"
				key={key}
				childKeys={[102, 103]}
				children={{
					firstFrame: [
						!secondWindowOpened ? [<MainMap key={1} />] : [],
						[<SpectrumTargetChart key={2} />, <CommonTargetsTable key={3} />],
					],
					secondFrame: [
						<SplitFrame
							frameDirection="horizontal"
							key={key2}
							childKeys={[106, 107]}
							children={{
								firstFrame: [
									<SplitFrame
										frameDirection="vertical"
										key={104}
										childKeys={[108, 109]}
										children={{
											firstFrame: [<SpectrumTargetChart key={4} />],
											secondFrame: [<CommonTargetsTable key={5} />],
										}}
									/>,
								],
								secondFrame: !secondWindowOpened && [<CommonTargetsTable key={6} />],
							}}
						/>,
					],
				}}
			/>
		</div>
	)
}
