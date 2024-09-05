import styles from './pulseTable.module.css'
import { useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { MenuItem, Typography } from '@mui/material'
import { PiMapPinAreaBold } from 'react-icons/pi'
import { RiInboxArchiveLine } from 'react-icons/ri'
import { CustomTargetTable } from '../../../shared/tables/customTargetsTable'
import { MenuContextTable } from '../../../shared/menu/tableContextMenu'
import { IoIosConstruct } from 'react-icons/io'
import { useAppSelector } from '../../../app/store/hooks'
import { formatDateTimeRu, formatNumber } from '../../../shared/utils/utils'
import { IRadarsList } from '../../../shared/webSocket/IWebSocket'
import { selectRadarsList } from '../../../shared/webSocket/serverConnectionSlice'

const columns: GridColDef[] = [
	{ field: 'id', headerName: '№', width: 30 },
	{
		field: 'uid',
		headerName: 'РЛС',
		valueGetter: (value: string) => value.slice(0, 8),
	},
	{
		field: 'freq',
		headerName: 'Частота',
		valueGetter: value => formatNumber(value),
	},
	{
		field: 'pulse_length',
		headerName: 'Длительность импульса',
		valueGetter: value => formatNumber(value),
	},
	{
		field: 'PRI',
		headerName: 'ПСИ',
		valueGetter: value => formatNumber(value),
	},
	{
		field: 'bearing',
		headerName: 'Пеленг',
		valueGetter: (value, row: IRadarsList) => formatNumber(row.bearing.bearing),
	},
	{
		field: 'rot_period',
		headerName: 'Период вращения',
		valueGetter: value => formatNumber(value),
	},
	{
		field: 'detection_time',
		headerName: 'Время обнаружения',
		valueGetter: (value: string) => formatDateTimeRu(value),
	},
	{
		field: 'identification_data',
		headerName: 'БД инфо',
		valueGetter: (value: string) => value.slice(0, 8),
	},
	{ field: 'comment', headerName: 'Комментарий' },
]

//Title DataGrid Toolbar
function CustomTitle() {
	return (
		<Typography align="center" sx={{ backgroundColor: '#112d49' }}>
			Таблица целей
		</Typography>
	)
}

//X-Data-Grid
export const PulseTable = () => {
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number
		mouseY: number
	} | null>(null)
	const [idSelectedRow, setIdSelectedRow] = useState<number>()
	const dataRadars = useAppSelector(selectRadarsList)

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault()
		setIdSelectedRow(Number(event.currentTarget.getAttribute('data-id')))

		setContextMenu(
			contextMenu === null
				? {
						mouseX: event.clientX - 2,
						mouseY: event.clientY - 4,
					}
				: null,
		)
	}

	const handleClose = () => {
		setContextMenu(null)
	}

	const handleHighlightOnMap = () => {
		if (idSelectedRow) {
			// Добавьте здесь код для подсветки на карте
			console.log(`Подсветить на карте: объект с ID ${idSelectedRow}`)
		}
		handleClose()
	}

	const handleSaveToDatabase = () => {
		if (idSelectedRow) {
			// Добавьте здесь код для сохранения в базу данных
			console.log(`Сохранить в базу данных: объект с ID ${idSelectedRow}`)
		}
		handleClose()
	}

	const handlePresentToConsole = () => {
		if (idSelectedRow) {
			// Найти объект в массиве currentTargets по выбранному id
			const selectedObject = dataRadars.find(target => target.id === idSelectedRow)

			// Вывести объект в консоль
			console.log(selectedObject)
		}
		handleClose()
	}

	return (
		<div className={styles.table__container}>
			<CustomTargetTable
				checkboxSelection
				aria-label="Targets_table"
				rows={dataRadars}
				columns={columns}
				disableColumnMenu
				columnHeaderHeight={36}
				rowHeight={28}
				slotProps={{
					row: {
						onContextMenu: handleContextMenu,
						style: { cursor: 'context-menu' },
					},
				}}
				getRowClassName={params => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
				slots={{
					toolbar: CustomTitle,
				}}
				localeText={{
					noRowsLabel: 'Целей не обнаружено',
					columnHeaderSortIconLabel: 'Сортировать',
				}}
			/>
			<MenuContextTable
				open={contextMenu !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
					contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
				}
				slotProps={{
					root: {
						onContextMenu: event => {
							event.preventDefault()
							handleClose()
						},
					},
				}}
			>
				<MenuItem onClick={handleHighlightOnMap} disableRipple>
					<PiMapPinAreaBold />
					Подсветить на карте
				</MenuItem>
				<MenuItem onClick={handleSaveToDatabase}>
					<RiInboxArchiveLine />
					Сохранить в базу
				</MenuItem>
				<MenuItem onClick={handlePresentToConsole}>
					<IoIosConstruct />
					Показать объект
				</MenuItem>
			</MenuContextTable>
		</div>
	)
}
