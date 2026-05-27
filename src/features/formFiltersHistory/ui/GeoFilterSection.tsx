import styles from './formFiltersHistory.module.scss'
import { useEffect } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { RiCloseLargeFill, RiEditLine, RiAddLargeFill } from 'react-icons/ri'
import { TypeSchemaHistoryFiltersForm } from '../model/schema'
import { removeGeoArea, selectGeoAreas } from '../model/historyFiltersSlice'
import {
	cancelDrawing,
	selectGeoDrawingMode,
	selectGeoEditingIndex,
	startDrawing,
	startEditing,
} from '@/widgets/historyMap'
import { ButtonAddBand, ButtonDeleteFilter, ButtonEditFilter } from '@/shared/buttons'

export const GeoFilterSection = () => {
	const { control } = useFormContext<TypeSchemaHistoryFiltersForm>()
	const dispatch = useAppDispatch()
	const geoAreas = useAppSelector(selectGeoAreas)
	const drawingMode = useAppSelector(selectGeoDrawingMode)
	const editingIndex = useAppSelector(selectGeoEditingIndex)
	const { replace } = useFieldArray({ control, name: 'geoFilter.bands' })

	// Redux → RHF синхронизация
	useEffect(() => {
		replace(geoAreas)
	}, [geoAreas])

	const isIdle = drawingMode === 'idle'

	return (
		<>
			{/* Список сохранённых областей */}
			{geoAreas.map((area, index) => (
				<div
					key={index}
					className={styles.formItem}
					style={{
						alignItems: 'center',
						opacity: !isIdle && editingIndex !== index ? 0.4 : 1,
					}}
				>
					<span style={{ flex: 1, fontSize: 16, marginLeft: 10 }}>{area.name}</span>
					<span style={{ color: '#8f8f8f', fontSize: 12, marginRight: 8 }}>
						{area.latLng[0].length} точек
					</span>
					<ButtonEditFilter
						onClick={() => dispatch(startEditing(index))}
						type="button"
						disabled={!isIdle}
					>
						<RiEditLine />
					</ButtonEditFilter>
					<ButtonDeleteFilter
						onClick={() => dispatch(removeGeoArea(index))}
						type="button"
						disabled={!isIdle}
						sx={{ ml: '6px' }}
					>
						<RiCloseLargeFill />
					</ButtonDeleteFilter>
				</div>
			))}

			{/* Кнопка Добавить — только в режиме idle */}
			{isIdle && (
				<ButtonAddBand
					variant="outlined"
					startIcon={<RiAddLargeFill />}
					onClick={() => dispatch(startDrawing())}
					type="button"
					className={styles.buttonAddBand}
				>
					Добавить область
				</ButtonAddBand>
			)}

			{/* Подсказка в режиме рисования */}
			{drawingMode === 'drawing' && (
				<>
					<p
						style={{
							color: '#4fc3f7',
							fontSize: 14,
							margin: '0 0 8px',
							padding: '0 4px',
							textAlign: 'center',
						}}
					>
						Кликайте по карте для добавления точек.
						<br />
						Двойной клик — завершить область.
					</p>
					<ButtonAddBand
						variant="outlined"
						onClick={() => dispatch(cancelDrawing())}
						type="button"
						className={styles.buttonAddBand}
						sx={{ color: '#ac0404', borderColor: '#404041' }}
					>
						Отмена
					</ButtonAddBand>
				</>
			)}

			{/* Подсказка в режиме редактирования */}
			{drawingMode === 'editing' && (
				<p
					style={{
						color: '#ffb74d',
						fontSize: 14,
						margin: '0',
						padding: '0 4px',
						textAlign: 'center',
					}}
				>
					Перетащите точки на карте для изменения области.
					<br />
					Подтвердите или отмените изменения на карте.
				</p>
			)}
		</>
	)
}
