import styles from './slaveMainPage.module.css'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/app/store/hooks'
import { SplitFrame } from '@/entities/splitFrame'
import { selectModeIdentification } from '@/widgets/header/model/controlModesSlice'
import { MainMap } from '@/widgets/mainMap'
import { RadarsTable } from '@/widgets/radarsTable'
import { SwitchIdentificationMode } from '@/features/switchIdentificationMode'
import { SwitchReferenceMode } from '@/features/switchReferenceMode'

export const SlaveMainPage = () => {
	console.log('RENDER_SLAVE_MAIN_PAGE')
	const identificationMode = useAppSelector(selectModeIdentification)

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.header__container}>
					<SwitchIdentificationMode />
					<SwitchReferenceMode />
				</div>
			</header>
			<div className={styles.body}>
				<SplitFrame frameDirection="horizontal" key={identificationMode ? 1 : 0}>
					<MainMap />
					{identificationMode ? null : <RadarsTable />}
				</SplitFrame>
			</div>
		</div>
	)
}
