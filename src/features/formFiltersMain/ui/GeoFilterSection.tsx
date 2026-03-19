import { useEffect } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { TypeSchemaMainFiltersForm } from '../model/schema'
import { ButtonDeleteFilter, ButtonAddBand } from '../../../shared/buttons'
import { RiCloseLargeFill, RiEditLine } from 'react-icons/ri'
import { RiAddLargeFill } from 'react-icons/ri'
import { IconButton, styled } from '@mui/material'
import {
	removeGeoArea,
	selectGeoAreas,
	selectGeoDrawingMode,
	selectGeoEditingIndex,
	setGeoDrawingMode,
	setGeoEditingIndex,
} from '../model/mainFiltersSlice'

const ButtonEditFilter = styled(IconButton)(() => ({
	color: '#4fc3f7',
	border: '1px solid',
	borderColor: '#404041',
	borderRadius: '5px',
	width: '40px',
	height: '40px',
	'&:hover': {
		color: '#81d4fa',
		borderColor: '#8b8f94',
		backgroundColor: '#6d6d6d17',
	},
}))

export const GeoFilterSection = () => {
	const { control } = useFormContext<TypeSchemaMainFiltersForm>()
	const dispatch = useAppDispatch()
	const geoAreas = useAppSelector(selectGeoAreas)
	const drawingMode = useAppSelector(selectGeoDrawingMode)
	const editingIndex = useAppSelector(selectGeoEditingIndex)
	const { replace } = useFieldArray({ control, name: 'geoFilter.bands' })

	// Redux → RHF синхронизация
	useEffect(() => {
		replace(geoAreas)
	}, [geoAreas])

	const handleStartDrawing = () => {
		dispatch(setGeoDrawingMode('drawing'))
	}

	const handleStartEditing = (index: number) => {
		dispatch(setGeoEditingIndex(index))
	}

	const handleCancelDrawing = () => {
		dispatch(setGeoDrawingMode('idle'))
	}

	return (
		<div style={{ padding: '8px 0' }}>
			{/* Список сохранённых областей */}
			{geoAreas.map((area, index) => (
				<div
					key={index}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						padding: '4px 16px',
						borderBottom: '1px solid rgba(255,255,255,0.06)',
						opacity: editingIndex !== null && editingIndex !== index ? 0.4 : 1,
					}}
				>
					<span style={{ fontSize: 14, flex: 1 }}>{area.name}</span>
					<span style={{ color: '#8f8f8f', fontSize: 12 }}>{area.latLng[0].length} точек</span>
					<ButtonEditFilter
						onClick={() => handleStartEditing(index)}
						type="button"
						disabled={drawingMode !== 'idle'}
						size="small"
					>
						<RiEditLine />
					</ButtonEditFilter>
					<ButtonDeleteFilter
						onClick={() => dispatch(removeGeoArea(index))}
						type="button"
						disabled={drawingMode !== 'idle'}
						size="small"
					>
						<RiCloseLargeFill />
					</ButtonDeleteFilter>
				</div>
			))}

			{/* Кнопка Добавить — только в режиме idle */}
			{drawingMode === 'idle' && (
				<div style={{ padding: '8px 16px' }}>
					<ButtonAddBand
						variant="outlined"
						startIcon={<RiAddLargeFill />}
						onClick={handleStartDrawing}
						type="button"
						fullWidth
					>
						Добавить область
					</ButtonAddBand>
				</div>
			)}

			{/* Подсказка в режиме рисования */}
			{drawingMode === 'drawing' && (
				<div style={{ padding: '8px 16px' }}>
					<p style={{ color: '#4fc3f7', fontSize: 12, margin: '0 0 8px' }}>
						Кликайте по карте для добавления точек.
						<br />
						Двойной клик — завершить область.
					</p>
					<ButtonAddBand
						variant="outlined"
						onClick={handleCancelDrawing}
						type="button"
						fullWidth
						sx={{ color: '#ac0404', borderColor: '#404041' }}
					>
						Отмена
					</ButtonAddBand>
				</div>
			)}

			{/* Подсказка в режиме редактирования */}
			{drawingMode === 'editing' && (
				<div style={{ padding: '8px 16px' }}>
					<p style={{ color: '#ffb74d', fontSize: 12, margin: '0 0 8px' }}>
						Перетащите точки для изменения области.
						<br />
						Подтвердите или отмените изменения на карте.
					</p>
				</div>
			)}
		</div>
	)
}
