import styles from './slaveMainPage.module.css'

import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../app/store/hooks'
import { SplitFrame } from '../../../entities/splitFrame'
import {
	selectModeIdentification,
	selectModeSecondWindow,
} from '../../../widgets/header/model/controlModesSlice'
import { MainMap } from '../../../widgets/mainMap'
import { RadarsTable } from '../../../widgets/radarsTable'

export const SlaveMainPage = () => {
	console.log('slaveMainPage')
	// const secondWindowOpened = useAppSelector(selectModeSecondWindow)
	const identificationMode = useAppSelector(selectModeIdentification)
	const [key, setKey] = useState(108)

	useEffect(() => {
		identificationMode ? setKey(110) : setKey(108)
		console.log(identificationMode)
	}, [identificationMode])

	return (
		<div className={styles.container}>
			<SplitFrame frameDirection="horizontal" key={key}>
				<MainMap key={0} />
				{identificationMode ? null : <RadarsTable key={6} />}
			</SplitFrame>
		</div>
	)
}
