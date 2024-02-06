import { type FunctionComponent, useMemo, useState } from 'react'
import { useObservable } from 'react-use'
import { Scrollable } from '../../../_components/Scrollable'
import { Header, HeaderSection } from '../../../_components/Header'
import { Button } from '../../../_components/Button'
import {  staff$ } from '../../../_state/store'
import { staffSortByOccurrenceState } from '../../../_utils/staffSort'
import { FullscreenOverlay } from '../../../_components/FullScreenOverlay'
import { useEscapeKey } from '../../../_utils/useEscapeKey'
import { TagGrid } from '../../../_components/TagGrid'
import { StaffTag } from '../../../_components/StaffTag'

type ShiftWizardProps = {
	onClose: () => void
}

export const ShiftWizard: FunctionComponent<ShiftWizardProps> = ({ onClose }) => {
	const staff = useObservable(staff$, {})
	
	const sortedStaff = useMemo(() => {
		const entries = Object.values(staff)
		entries.sort(staffSortByOccurrenceState)
		return entries
	}, [staff])

	const [selected, setSelected] = useState<string[]>([])
	
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

	useEscapeKey(onClose)

	return (
		<FullscreenOverlay className='flex flex-col justify-center items-center'>
			<div className='absolute top-0 left-0 w-full h-full backdrop-blur-md' />

			<div className='flex bg-[#000] rounded-xl z-10 w-full max-w-7xl max-h-full p-5 pb-10'>
				<div className='w-full text-action flex flex-col overflow-hidden'>
					<Header className="px-0 pt-0 mb-5">
						<HeaderSection>
							<Button onClick={onClose}>Cancelar</Button>
						</HeaderSection>
						
						<HeaderSection>
						</HeaderSection>
					</Header>

					<Scrollable>
						<TagGrid>
							{sortedStaff.map((staff, index) => (
								<StaffTag
									key={staff.internalId}
									index={index}
									internalId={staff.internalId}
									label={staff.label}
									onClick={onSelect}
									rank={staff.rank}
									selected={selected.includes(staff.internalId)}
									state={staff.state}
								/>
							))}
						</TagGrid>
					</Scrollable>
				</div>
			</div>
		</FullscreenOverlay>
	)
}
