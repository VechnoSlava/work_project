import styles from './slaveMainPage.module.css'

import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../app/store/hooks'
import { SplitFrame } from '../../../entities/splitFrame'
import { selectModeIdentification } from '../../../widgets/header/model/controlModesSlice'
import { MainMap } from '../../../widgets/mainMap'
import { RadarsTable } from '../../../widgets/radarsTable'
import { SwitchIdentificationMode } from '../../../features/switchIdentificationMode'
import { SwitchReferenceMode } from '../../../features/switchReferenceMode'

export const SlaveMainPage = () => {
	console.log('RENDER_SLAVE_MAIN_PAGE')
	const identificationMode = useAppSelector(selectModeIdentification)
	const [key, setKey] = useState(108)

	useEffect(() => {
		identificationMode ? setKey(110) : setKey(108)
		console.log(identificationMode)
	}, [identificationMode])

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.header__container}>
					<SwitchIdentificationMode />
					<SwitchReferenceMode />
				</div>
			</header>
			<div className={styles.body}>
				<SplitFrame frameDirection="horizontal" key={key}>
					<MainMap key={0} />
					{identificationMode ? null : <RadarsTable key={6} />}
				</SplitFrame>
			</div>
		</div>
	)
}
