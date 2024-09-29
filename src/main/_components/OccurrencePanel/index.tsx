import { type FunctionComponent, useMemo, useState } from 'react'
import { useObservable } from 'react-use'
import { activeOccurrences$, deleteActiveOccurrence$, occurrences$, staff$, vehicles$ } from '../../../_state/store'
import { Button } from '../../../_components/Button'
import { Scrollable } from '../../../_components/Scrollable'
import { staffSortByLabel } from '../../../_utils/staffSort'
import { vehicleSortByLabel } from '../../../_utils/vehicleSort'
import { CardGrid } from '../../../_components/CardGrid'
import { VehicleCard } from '../../../_components/VehicleCard'
import { StaffCard } from '../../../_components/StaffCard'
import { Modal } from '../../../_components/Modal'
import { ActiveOccurrenceWizard } from '../ActiveOccurrenceWizard'
import { Header, HeaderSection } from '../../../_components/Header'
import { sendOccurrenceAlert } from '../../../_utils/sendAlert'
import { ConfirmationPanel } from '../ConfirmationPanel'
import { useLanguageStore } from '../../../_state/lang'

type OccurrencePanelProps = {
  internalId: string
  onClose: () => void
}

export const OccurrencePanel: FunctionComponent<OccurrencePanelProps> = ({ internalId, onClose }) => {
	const { languageData } = useLanguageStore()
	const activeOccurrenceMap = useObservable(activeOccurrences$, {})
	const staffMap = useObservable(staff$, {})
	const vehicleMap = useObservable(vehicles$, {})
	const occurrenceMap = useObservable(occurrences$, {})

	const activeOccurrence = activeOccurrenceMap[internalId] ?? {}
	const occurrence = occurrenceMap[activeOccurrence.occurrenceId] ?? {}
	const staffIds = activeOccurrence.staffIds ?? []
	const vehicleIds = activeOccurrence.vehicleIds ?? []

	const sortedVehicles = useMemo(() => {
		// TODO Remove filter once entries removed correctly from ocurrences
		const entrySet = vehicleIds.map((id) => vehicleMap[id]).filter(Boolean)
		entrySet.sort(vehicleSortByLabel)
		return entrySet
	}, [vehicleMap])

	const sortedStaff = useMemo(() => {
		// TODO Remove filter once entries removed correctly from ocurrences
		const entrySet = staffIds.map((id) => staffMap[id]).filter(Boolean)
		entrySet.sort(staffSortByLabel)
		return entrySet
	}, [staffMap])

	const onSendAlert = () => {
		sendOccurrenceAlert(activeOccurrence.occurrenceId, activeOccurrence.vehicleAssignmentMap)
	}

	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
	const onDelete = setShowDeleteConfirmation.bind(null, true)
	const onCancelDeletion = setShowDeleteConfirmation.bind(null, false)

	const onConfirmDeletion = () => {
		deleteActiveOccurrence$.next(internalId)
		onClose()
	}

	const [showCreateOccurrence, setShowCreateOccurrence] = useState(false)

	return (
		<div className="absolute top-0 left-0 flex flex-col w-full h-full z-10 select-none bg-background text-primary pb-5">
			<Header className="bg-backgroundEmphasis mb-5">
				<HeaderSection>
					<Button onClick={onClose}>{languageData['occurrence_details.back']}</Button>
				</HeaderSection>

				<HeaderSection>
					<Button onClick={onSendAlert}>{languageData['occurrence_details.send_alert']}</Button>
					<Button onClick={setShowCreateOccurrence.bind(null, true)}>
						{languageData['occurrence_details.change_occurrence']}
					</Button>
					<Button onClick={onDelete}>{languageData['occurrence_details.close_occurrence']}</Button>
				</HeaderSection>
			</Header>

			<div className="flex flex-row justify-between px-5">
				<div className="text-2xl font-extrabold">
					{languageData['occurrence_details.manage_occurrence']} - {occurrence.name}
				</div>
			</div>

			<div className="flex flex-row gap-2 px-5">
				<div className="font-extrabold">{languageData['occurrence_details.form.location']}</div>
				{activeOccurrence.location}
			</div>

			<div className="flex flex-row gap-2 px-5">
				<div className="font-extrabold">{languageData['occurrence_details.form.address']}</div>
				{activeOccurrence.address}
			</div>

			<div className="flex flex-row gap-3 px-5">
				<div className="font-extrabold">{languageData['occurrence_details.form.description']}</div>
				{activeOccurrence.description}
			</div>

			<div className="flex flex-row gap-2 px-5">
				<div className="font-extrabold">{languageData['occurrence_details.form.reference_point']}</div>
				{activeOccurrence.referencePoint}
			</div>

			<div className="flex flex-row gap-2 px-5">
				<div className="font-extrabold">{languageData['occurrence_details.form.codu_number']}</div>
				{activeOccurrence.coduNumber}
			</div>

			<div className="flex flex-row gap-2 px-5">
				<div className="font-extrabold">{languageData['occurrence_details.form.vmer_siv']}</div>
				{languageData[activeOccurrence.vmerSiv ? 'terms.yes' : 'terms.no']}
			</div>

			<Scrollable className="px-5">
				<h2 className="px-5 my-5 text-actionHighlight font-extrabold text-2xl">{languageData['terms.vehicles']}</h2>

				<CardGrid small>
					{sortedVehicles.map((vehicle) => (
						<VehicleCard
							key={vehicle.internalId}
							label={vehicle.label}
							image={vehicle.image}
							internalId={vehicle.internalId}
							small
							state={vehicle.state}
						/>
					))}
				</CardGrid>

				<h2 className="px-5 my-5 text-actionHighlight font-extrabold text-2xl">{languageData['terms.staff']}</h2>

				<CardGrid small>
					{sortedStaff.map((staff) => (
						<StaffCard
							key={staff.internalId}
							label={staff.label}
							image={staff.image}
							internalId={staff.internalId}
							name={staff.name}
							small
							state={staff.state}
						/>
					))}
				</CardGrid>
			</Scrollable>

			{showCreateOccurrence && (
				<Modal>
					<ActiveOccurrenceWizard internalId={internalId} onClose={setShowCreateOccurrence.bind(null, false)} />
				</Modal>
			)}

			{showDeleteConfirmation && (
				<Modal>
					<ConfirmationPanel
						acceptPrompt={languageData['occurrence_details.close.accept']}
						cancelPrompt={languageData['occurrence_details.close.cancel']}
						onClose={onCancelDeletion}
						onConfirm={onConfirmDeletion}
						prompt={languageData['occurrence_details.close.prompt']}
					/>
				</Modal>
			)}
		</div>
	)
}
