import { type FunctionComponent, useMemo, useState, useEffect } from 'react'
import { useObservable } from 'react-use'
import { Scrollable } from '../../../_components/Scrollable'
import { Header, HeaderSection } from '../../../_components/Header'
import { Button } from '../../../_components/Button'
import { staff$, updateShift$ } from '../../../_state/store'
import { staffSortByLabel } from '../../../_utils/staffSort'
import { FullscreenOverlay } from '../../../_components/FullScreenOverlay'
import { useEscapeKey } from '../../../_utils/useEscapeKey'
import { TagGrid } from '../../../_components/TagGrid'
import { StaffTag } from '../../../_components/StaffTag'
import { StaffState } from '../../../_consts/native'
import { useLanguageStore } from '../../../_state/lang'

type ShiftWizardProps = {
  onClose: () => void
}

export const ShiftWizard: FunctionComponent<ShiftWizardProps> = ({ onClose }) => {
	const { languageData } = useLanguageStore()
	const staff = useObservable(staff$, {})

	const sortedStaff = useMemo(() => {
		const entries = Object.values(staff)
		entries.sort(staffSortByLabel)
		return entries
	}, [staff])

	// Start with 'Dispatched' default selected as they are currently on duty
	const [selected, setSelected] = useState<string[]>([])

	const staffReady = sortedStaff.length > 0
	useEffect(() => {
		setSelected(sortedStaff.filter((staff) => staff.state === StaffState.Dispatched).map((staff) => staff.internalId))
	}, [staffReady])

	const onSelect = (staffId: string) => {
		setSelected((prevSelected) => {
			const foundIdx = prevSelected.indexOf(staffId)
			if (foundIdx >= 0) {
				const nextSelected = prevSelected.slice()
				nextSelected.splice(foundIdx, 1)
				return nextSelected
			}

			return [...prevSelected, staffId]
		})
	}

	const onConfirm = () => {
		updateShift$.next(selected)
		onClose()
	}

	const onSelectShiftStaff = () => {
		const shiftStaffIds = sortedStaff
			.filter((staff) => staff.state === StaffState.Dispatched || staff.state === StaffState.Available)
			.map((staff) => staff.internalId)
		setSelected(shiftStaffIds)
	}

	useEscapeKey(onClose)

	return (
		<FullscreenOverlay className="flex flex-col justify-center items-center">
			<div className="absolute top-0 left-0 w-full h-full backdrop-blur-md" />

			<div className="flex bg-[#000] rounded-xl z-10 w-full max-w-7xl max-h-full p-5 pb-10">
				<div className="w-full text-action flex flex-col overflow-hidden">
					<Header className="px-0 pt-0 mb-5">
						<HeaderSection>
							<Button onClick={onClose}>{languageData['terms.cancel']}</Button>
						</HeaderSection>

						<HeaderSection>
							<Button onClick={onSelectShiftStaff}>{languageData['shift_wizard.select_staff']}</Button>
							<Button onClick={onConfirm}>{languageData['shift_wizard.confirm']}</Button>
						</HeaderSection>
					</Header>

					<Scrollable>
						<TagGrid>
							{sortedStaff.map((staff, index) => (
								<StaffTag
									key={staff.internalId}
									disabled={staff.state === StaffState.Dispatched}
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
