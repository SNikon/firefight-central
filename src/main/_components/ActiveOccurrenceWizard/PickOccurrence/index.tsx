import { type FunctionComponent, useMemo } from 'react'
import { useObservable } from 'react-use'
import { CardGrid } from '../../../../_components/CardGrid'
import { Scrollable } from '../../../../_components/Scrollable'
import { Header } from '../../../../_components/Header'
import { Button } from '../../../../_components/Button'
import { occurrences$ } from '../../../../_state/store'
import { OccurrenceCard } from '../../../../_components/OccurrenceCard'
import { occurrenceSortByLabel } from '../../../../_utils/occurrenceSort'

type PickOccurrenceProps = {
	initialValue: string
	onCancel: () => void
	onNext: (value: string) => void
}

export const PickOccurrence: FunctionComponent<PickOccurrenceProps> = ({ initialValue, onCancel, onNext }) => {
	const occurrences = useObservable(occurrences$, {})
	const sortedOccurrences = useMemo(() => {
		const entries = Object.values(occurrences)
		entries.sort(occurrenceSortByLabel)
		return entries
	}, [occurrences])

	return (
		<div className='w-full text-action flex flex-col overflow-hidden'>
			<Header className="px-0 pt-0 mb-5">
				<Button onClick={onCancel}>Cancelar</Button>
			</Header>

			<Scrollable>
				<CardGrid>
					{sortedOccurrences.map(occurrence => (
						<OccurrenceCard
							key={occurrence.internalId}
							internalId={occurrence.internalId}
							name={occurrence.name}
							onClick={onNext}
							selected={occurrence.internalId === initialValue}
						/>
					))}
				</CardGrid>
			</Scrollable>
		</div>
	)
}