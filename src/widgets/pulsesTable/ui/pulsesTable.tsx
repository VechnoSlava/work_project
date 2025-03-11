import styles from './pulsesTable.module.css'
import { useEffect, useState } from 'react'
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { MenuItem, Typography } from '@mui/material'
import { PiMapPinAreaBold } from 'react-icons/pi'
import { RiInboxArchiveLine } from 'react-icons/ri'
import { CustomTargetTable } from '../../../shared/tables/customTargetsTable'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { formatNumber } from '../../../shared/utils/utils'
import { selectTadsTable } from '../../../shared/webSocket/serverConnectionSlice'
import { ITadRadarList } from '../../../shared/webSocket/IWebSocket'
import { MenuContextTable } from '../../../shared/menu/tableContextMenu'
import { addSelectedTad } from '../model/pulsesTableSlice'

//Form table DataGrid
const columns: GridColDef[] = [
	{ field: 'id', headerName: '№', width: 30 },
	{
		field: 'radar',
		headerName: 'РЛС',
		valueGetter: (value: string) => value.slice(0, 8),
	},
	{
		field: 'freq',
		headerName: 'Центральная частота',
		valueGetter: value => formatNumber(value),
	},
	{
		field: 'pulse_length',
		headerName: 'Длительность импульса',
		valueGetter: value => formatNumber(value),
	},
	{
		field: 'pulse_amplitude',
		headerName: 'Амплитуда',
		valueGetter: value => formatNumber(value).split(',').shift(),
	},
]

//Title DataGrid Toolbar
function CustomTitle() {
	return (
		<Typography align="center" sx={{ backgroundColor: '#112d49' }}>
			Таблица импульсов
		</Typography>
	)
}

//Component X-Data-Grid
export const PulsesTable = () => {
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number
		mouseY: number
	} | null>(null)
	const [idSelectedRow, setIdSelectedRow] = useState<number>()
	const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])
	const dispatch = useAppDispatch()

	const dataTadsTable = useAppSelector(selectTadsTable)
	console.log(dataTadsTable)

	let dataImpulses: ITadRadarList[] = []

	if (dataTadsTable.length > 0) {
		dataImpulses = dataTadsTable[0].data
	}

	// const selectedTarget = useAppSelector(selectSelectedRadars)
	// console.log(selectedTarget)
	// useEffect(() => {}, [selectedTarget])

	// Function for get uid from selected rows
	const getSelectedId = () => {
		const selectedId = rowSelectionModel
			.map(id => {
				const selectedRow = dataImpulses.find(row => row.id === id)
				return selectedRow ? { id: selectedRow.id } : null
			})
			.filter(uidObj => uidObj !== null) //Remove null values
		return selectedId
	}
	// Send selected id on server for get data pulses
	const sendMessageToWebSocket = () => {
		const selectedTad = getSelectedId()
		// dispatch(addSelectedTad(selectedTad))
	}

	useEffect(() => {
		if (rowSelectionModel.length > 0) {
			sendMessageToWebSocket()
		}
	}, [rowSelectionModel])

	//Open ContextMenu
	const handleContextMenuOpen = (event: React.MouseEvent) => {
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

	//Close ContextMenu
	const handleContextMenuClose = () => {
		setContextMenu(null)
	}

	const handleHighlightOnMap = () => {
		if (idSelectedRow) {
			// Добавьте здесь код для подсветки на карте
			console.log(`Подсветить на карте: объект с ID ${idSelectedRow}`)
		}
		handleContextMenuClose()
	}

	const handleSaveToDatabase = () => {
		if (idSelectedRow) {
			// Добавьте здесь код для сохранения в базу данных
			console.log(`Сохранить в базу данных: объект с ID ${idSelectedRow}`)
		}
		handleContextMenuClose()
	}

	return (
		<div className={styles.table__container}>
			<CustomTargetTable
				// checkboxSelection
				aria-label="Tads_table"
				rows={dataImpulses}
				columns={columns}
				disableColumnMenu
				columnHeaderHeight={36}
				rowHeight={28}
				onRowSelectionModelChange={newRowSelectionModel => {
					setRowSelectionModel(newRowSelectionModel)
				}}
				rowSelectionModel={rowSelectionModel}
				slotProps={{
					row: {
						onContextMenu: handleContextMenuOpen,
						style: { cursor: 'context-menu' },
					},
				}}
				getRowClassName={params => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
				slots={
					{
						// toolbar: CustomTitle,
					}
				}
				localeText={{
					noRowsLabel: 'Выберите РЛС',
					columnHeaderSortIconLabel: 'Сортировать',
				}}
			/>
			<MenuContextTable
				open={contextMenu !== null}
				onClose={handleContextMenuClose}
				anchorReference="anchorPosition"
				anchorPosition={
					contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
				}
				slotProps={{
					root: {
						onContextMenu: event => {
							event.preventDefault()
							handleContextMenuClose()
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
				{/* <MenuItem onClick={handlePresentToConsole}>
				<IoIosConstruct />
				Показать объект
			</MenuItem> */}
			</MenuContextTable>
		</div>
	)
}
