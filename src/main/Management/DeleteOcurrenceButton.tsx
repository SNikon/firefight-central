import { CustomCellRendererProps } from 'ag-grid-react'
import { FunctionComponent } from 'react'
import { Button } from '../../_components/Button'
import { Occurrence } from '../../_consts/native'
import { deleteOccurrence$ } from '../../_state/store'

export const DeleteOccurrenceButton: FunctionComponent<CustomCellRendererProps<Occurrence>> = (props) => {
	const onClick = () => {
		deleteOccurrence$.next(props.data!.internalId)
	}

	return (
		<Button className="min-h-0 h-full px-0 py-0" onClick={onClick}>
			Remover
		</Button>
	)
}
