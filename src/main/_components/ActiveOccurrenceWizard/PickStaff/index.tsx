import { type FunctionComponent, useMemo, useState, useEffect } from 'react'
import { Scrollable } from '../../../../_components/Scrollable'
import { Header, HeaderSection } from '../../../../_components/Header'
import { Button } from '../../../../_components/Button'
import { staffSortByOccurrenceState } from '../../../../_utils/staffSort'
import { Staff, StaffState } from '../../../../_consts/native'
import { TagGrid } from '../../../../_components/TagGrid'
import { StaffTag } from '../../../../_components/StaffTag'

type PickStaffProps = {
	alreadySelectedStaffIds: string[]
	capacity?: number
	initialValue: string[]
	onCancel: () => void
	onNext: (vehicleId: string, staff: string[]) => void
	onPrevious: () => void
	staff: Record<string, Staff>
	vehicleId: string
	vehicleLabel: string
}

export const PickStaff: FunctionComponent<PickStaffProps> = ({
	alreadySelectedStaffIds,
	capacity,
	initialValue,
	onCancel,
	onPrevious,
	onNext,
	staff,
	vehicleId,
	vehicleLabel
}) => {
	const sortedStaff = useMemo(() => {
		const entries = Object.values(staff).filter(staff => !alreadySelectedStaffIds.includes(staff.internalId) && (staff.state === StaffState.Available || staff.state === StaffState.Dispatched))
		entries.sort(staffSortByOccurrenceState)
		return entries
	}, [alreadySelectedStaffIds, staff])

	const [selected, setSelected] = useState<string[]>(initialValue)
	useEffect(() => setSelected(initialValue), [initialValue])

	const onSelect = (vehicleId: string) => {
		setSelected(prevSelected => {
			const foundIdx = prevSelected.indexOf(vehicleId)
			if (foundIdx >= 0) {
				const nextSelected = prevSelected.slice()
				nextSelected.splice(foundIdx, 1)
				return nextSelected
			}

			return [...prevSelected, vehicleId]
		})
	}

	return (
		<div className='w-full text-action flex flex-col overflow-hidden'>
			<Header className="px-0 pt-0 mb-5">
				<HeaderSection>
					<Button onClick={onCancel}>Cancelar</Button>
				</HeaderSection>

				<label className="h-full text-lg font-bold">
					Guarnição para {vehicleLabel}
					{capacity && ` (${selected.length}/${capacity})`}
				</label>
				
				<HeaderSection>
					{onPrevious && <Button onClick={onPrevious}>Voltar</Button>}
					<Button onClick={onNext.bind(null, vehicleId, selected)}>Seguinte</Button>
				</HeaderSection>
			</Header>

			<Scrollable>
				<TagGrid>
					{sortedStaff.map((staff, index) => (
						<StaffTag
							key={staff.internalId}
							index={index}
							label={staff.label}
							internalId={staff.internalId}
							onClick={onSelect}
							rank={staff.rank}
							selected={selected.includes(staff.internalId)}
							state={staff.state}
						/>
					))}
				</TagGrid>
			</Scrollable>
		</div>
	)
}