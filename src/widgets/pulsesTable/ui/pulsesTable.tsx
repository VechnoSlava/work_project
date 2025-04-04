import styles from './pulsesTable.module.css'
import { GridColDef } from '@mui/x-data-grid'
import { CustomTargetTable } from '../../../shared/tables/customTargetsTable'
import { useAppSelector } from '../../../app/store/hooks'
import { formatNumber } from '../../../shared/utils/utils'
import { selectTadsTable } from '../../../shared/webSocket/serverConnectionSlice'
import { ITadRadarList } from '../../../shared/webSocket/IWebSocket'

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

//Component X-Data-Grid
export const PulsesTable = () => {
	const dataTadsTable = useAppSelector(selectTadsTable)

	let dataImpulses: ITadRadarList[] = []

	if (dataTadsTable.length > 0) {
		dataImpulses = dataTadsTable[0].data
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
				getRowClassName={params => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
				localeText={{
					noRowsLabel: 'Выберите РЛС',
					columnHeaderSortIconLabel: 'Сортировать',
				}}
			/>
		</div>
	)
}
