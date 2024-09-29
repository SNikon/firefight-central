import { type FunctionComponent } from 'react'
import { useObservable } from 'react-use'
import { Header, HeaderSection } from '../../../../_components/Header'
import { Button } from '../../../../_components/Button'
import { occurrences$ } from '../../../../_state/store'
import { ActiveOccurrence, Staff, StaffState, Vehicle, VehicleState } from '../../../../_consts/native'
import { sendOccurrenceAlert } from '../../../../_utils/sendAlert'
import { useLanguageStore } from '../../../../_state/lang'

type ConfirmOccurrenceProps = {
  activeOccurrence?: ActiveOccurrence
  allowAlert: boolean
  occurrenceId: string
  onCancel: () => void
  onNext: () => void
  onPrevious: () => void
  staff: Record<string, Staff>
  staffIds: string[]
  vehicleAssignmentMap: Record<string, string[]>
  vehicleIds: string[]
  vehicles: Record<string, Vehicle>
}

export const ConfirmOccurrence: FunctionComponent<ConfirmOccurrenceProps> = ({
	activeOccurrence,
	allowAlert,
	occurrenceId,
	onCancel,
	onNext,
	onPrevious,
	staff,
	staffIds,
	vehicleAssignmentMap,
	vehicleIds,
	vehicles
}) => {
	const { languageData } = useLanguageStore()
	const occurrences = useObservable(occurrences$, {})
	const occurrence = occurrences[occurrenceId]?.name

	const onSendAlert = () => {
		sendOccurrenceAlert(occurrenceId, vehicleAssignmentMap)
		onNext()
	}
	// If there is a vehicle or staff that is not available and not in the active occurrence, add a warning
	const unavailableStaff = staffIds.filter(
		(staffId) => staff[staffId].state !== StaffState.Available && !activeOccurrence?.staffIds.includes(staffId)
	)
	const hasUnavailableStaff = unavailableStaff.length > 0
	const unavailableVehicles = vehicleIds.filter(
		(vehicleId) =>
			vehicles[vehicleId].state !== VehicleState.Available && !activeOccurrence?.vehicleIds.includes(vehicleId)
	)
	const hasUnavailableVehicles = unavailableVehicles.length > 0

	return (
		<div className="w-full text-action flex flex-col overflow-hidden">
			<Header className="px-0 pt-0 mb-5">
				<HeaderSection>
					<Button onClick={onCancel}>{languageData['terms.cancel']}</Button>
				</HeaderSection>

				<HeaderSection>
					{onPrevious && <Button onClick={onPrevious}>{languageData['terms.back']}</Button>}
					<Button onClick={onNext}>{languageData['occurrence_wizard.confirm']}</Button>
					{allowAlert && <Button onClick={onSendAlert}>{languageData['occurrence_wizard.confirm_alert']}</Button>}
				</HeaderSection>
			</Header>

			<p>
				{languageData['occurrence_wizard.occurrence_type']}: {occurrence}
			</p>

			<p>
				{languageData['terms.vehicles']}:&nbsp;
				{vehicleIds.map((vehicleId, idx) => (
					<>
						<span className={unavailableVehicles.includes(vehicleId) ? 'text-warning' : ''}>
							{vehicles[vehicleId]?.label}
						</span>
						{idx < vehicleIds.length - 1 ? ', ' : ''}
					</>
				))}
			</p>

			{hasUnavailableVehicles && <p className="text-warning">{languageData['occurrence_wizard.vehicles_warning']}</p>}

			<p>
				{languageData['terms.staff']}:&nbsp;
				{staffIds.map((staffId, idx) => (
					<>
						<span className={unavailableStaff.includes(staffId) ? 'text-warning' : ''}>{staff[staffId]?.label}</span>
						{idx < staffIds.length - 1 ? ', ' : ''}
					</>
				))}
			</p>

			{hasUnavailableStaff && <p className="text-warning">{languageData['occurrence_wizard.staff_warning']}</p>}
		</div>
	)
}
