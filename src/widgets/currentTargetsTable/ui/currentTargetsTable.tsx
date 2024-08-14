import styles from './currentTargetTable.module.css'
import { useState } from 'react'
import {
	GridColDef,
	gridPageCountSelector,
	gridPageSelector,
	GridPagination,
	GridRowsProp,
	useGridApiContext,
	useGridSelector,
} from '@mui/x-data-grid'
import MuiPagination from '@mui/material/Pagination'
import { MenuItem, TablePaginationProps } from '@mui/material'
import { PiMapPinAreaBold } from 'react-icons/pi'
import { RiInboxArchiveLine } from 'react-icons/ri'
import { CustomTargetTable } from '../../../shared/tables/customTargetsTable'
import { MenuContextTable } from '../../../shared/menu/tableContextMenu'
import { IoIosConstruct } from 'react-icons/io'

const currentTargets: GridRowsProp = [
	{ id: 767, frequency: 88.62, dt: 6.89, PSI: 62.97, Phase: 62.97, Amplitude: 62.97 },
	{ id: 597, frequency: 27.42, dt: 61.93, PSI: 43.15, Phase: 62.97, Amplitude: 62.97 },
	{ id: 890, frequency: 16.99, dt: 25.49, PSI: 35.08, Phase: 62.97, Amplitude: 62.97 },
	{ id: 64, frequency: 86.24, dt: 12.09, PSI: 29.34, Phase: 62.97, Amplitude: 62.97 },
	{ id: 219, frequency: 25.93, dt: 80.18, PSI: 72.41, Phase: 62.97, Amplitude: 62.97 },
	{ id: 907, frequency: 12.52, dt: 52.18, PSI: 81.6, Phase: 62.97, Amplitude: 62.97 },
	{ id: 945, frequency: 31.75, dt: 28.17, PSI: 5.15, Phase: 62.97, Amplitude: 62.97 },
	{ id: 46, frequency: 39.0, dt: 1.58, PSI: 66.76, Phase: 62.97, Amplitude: 62.97 },
	{ id: 56, frequency: 79.77, dt: 9.69, PSI: 1.19, Phase: 62.97, Amplitude: 62.97 },
	{ id: 119, frequency: 15.93, dt: 46.18, PSI: 16.69, Phase: 62.97, Amplitude: 62.97 },
	{ id: 69, frequency: 10.28, dt: 13.08, PSI: 6.07, Phase: 62.97, Amplitude: 62.97 },
	{ id: 377, frequency: 51.46, dt: 61.93, PSI: 89.28, Phase: 62.97, Amplitude: 62.97 },
	{ id: 135, frequency: 49.03, dt: 56.6, PSI: 48.0, Phase: 62.97, Amplitude: 62.97 },
	{ id: 413, frequency: 93.36, dt: 83.4, PSI: 54.67, Phase: 62.97, Amplitude: 62.97 },
	{ id: 308, frequency: 88.77, dt: 30.92, PSI: 28.82, Phase: 62.97, Amplitude: 62.97 },
	{ id: 162, frequency: 26.53, dt: 51.07, PSI: 34.28, Phase: 62.97, Amplitude: 62.97 },
	{ id: 430, frequency: 39.23, dt: 38.82, PSI: 94.06, Phase: 62.97, Amplitude: 62.97 },
	{ id: 380, frequency: 72.64, dt: 2.48, PSI: 99.7, Phase: 62.97, Amplitude: 62.97 },
]

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'РЛС' },
	{ field: 'frequency', headerName: 'Частота' },
	{ field: 'dt', headerName: 'Длительность импульса' },
	{ field: 'PSI', headerName: 'ПСИ' },
	{ field: 'Phase', headerName: 'Фаза' },
	{ field: 'Amplitude', headerName: 'Амплитуда' },
]

//Custom menu pagination
function Pagination({
	onPageChange,
	className,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
	const apiRef = useGridApiContext()
	const page = useGridSelector(apiRef, gridPageSelector)
	const pageCount = useGridSelector(apiRef, gridPageCountSelector)
	return (
		<MuiPagination
			className={className}
			variant="outlined"
			shape="rounded"
			size="small"
			count={pageCount}
			defaultPage={page}
			page={page + 1}
			onChange={(event: React.ChangeEvent<unknown>, newPage: number) => {
				onPageChange(event as any, newPage - 1)
			}}
			siblingCount={1} // Показывает одну страницу до и после текущей
		/>
	)
}

function CustomPagination(props: any) {
	return <GridPagination ActionsComponent={Pagination} {...props} />
}

//X-Data-Grid
export const CurrentTargetsTable = () => {
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number
		mouseY: number
	} | null>(null)
	const [idSelectedRow, setIdSelectedRow] = useState<number>()

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
			const selectedObject = currentTargets.find(target => target.id === idSelectedRow)

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
				rows={currentTargets}
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
					pagination: CustomPagination,
				}}
				initialState={{
					pagination: { paginationModel: { pageSize: 25, page: 0 } },
				}}
				localeText={{
					columnHeaderSortIconLabel: 'Сортировать',
					footerRowSelected: count =>
						count !== 1
							? `${count.toLocaleString()} строк выбрано`
							: `${count.toLocaleString()} строка выбрана`,
					footerTotalRows: 'Всего строк:',
					MuiTablePagination: {
						labelRowsPerPage: 'Строк на странице',
						labelDisplayedRows: ({ from, to, count }) =>
							`${from}-${to} из ${count !== -1 ? count : `более чем ${to}`}`,
					},
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
