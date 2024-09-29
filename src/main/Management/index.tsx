import { AgGridReact } from 'ag-grid-react'
import {
	CellValueChangedEvent,
	ClientSideRowModelModule,
	ColDef,
	GetRowIdFunc,
	ModuleRegistry
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css' // Optional Theme applied to the Data Grid
import { useObservable } from 'react-use'
import { useCallback, useMemo, useState } from 'react'
import { Header } from '../../_components/Header'
import { occurrences$, updateOccurrence$ } from '../../_state/store'
import { Occurrence } from '../../_consts/native'
import { Button } from '../../_components/Button'
import { Modal } from '../../_components/Modal'
import { useLanguageStore } from '../../_state/lang'
import { DeleteOccurrenceButton } from './DeleteOcurrenceButton'
import { OcurrenceTypePanel } from './OcurrenceTypePanel'

ModuleRegistry.registerModules([ClientSideRowModelModule])

const getRowId: GetRowIdFunc<Occurrence> = (row) => row.data.internalId

const occurrenceColumnDefs: Array<ColDef> = [
	{ field: 'internalId', headerName: 'Id Interno', width: 300, resizable: false, editable: false, sortable: false },
	{ field: 'name', headerName: 'Nome', flex: 1, resizable: true, editable: true, sort: 'desc' },
	{
		field: '',
		cellClass: 'p-0 pr-[5px]',
		cellRenderer: DeleteOccurrenceButton,
		sortable: false,
		resizable: false,
		editable: false,
		width: 128
	}
]

export const Management = () => {
	const { languageData } = useLanguageStore()

	const ocurrences = useObservable(occurrences$, {})
	const rowData = useMemo(() => Object.values(ocurrences), [ocurrences])

	const [showForm, setShowForm] = useState(false)
	const onCreate = setShowForm.bind(null, true)
	const onCloseForm = setShowForm.bind(null, false)

	const onChange = useCallback((evt: CellValueChangedEvent<Occurrence>) => {
		updateOccurrence$.next(evt.data)
	}, [])

	return (
		<div className="bg-body-background text-body-text flex flex-1 flex-col overflow-hidden select-none">
			<Header>
				<div />
				<Button onClick={onCreate}>{languageData['manage_occurrences.new_occurrence_type']}</Button>
			</Header>

			<div className="ag-theme-quartz flex-1 p-5 pt-0">
				<AgGridReact
					animateRows={false}
					columnDefs={occurrenceColumnDefs}
					getRowId={getRowId}
					onCellValueChanged={onChange}
					rowData={rowData}
				/>
			</div>

			{showForm && (
				<Modal>
					<OcurrenceTypePanel onClose={onCloseForm} />
				</Modal>
			)}
		</div>
	)
}
