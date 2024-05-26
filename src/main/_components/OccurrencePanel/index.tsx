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

type OccurrencePanelProps = {
	internalId: string
	onClose: () => void
}

export const OccurrencePanel: FunctionComponent<OccurrencePanelProps> = ({ internalId, onClose }) => {
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
		const entrySet = vehicleIds.map(id => vehicleMap[id]).filter(Boolean)
		entrySet.sort(vehicleSortByLabel)
		return entrySet
	}, [vehicleMap])

	const sortedStaff = useMemo(() => {
		// TODO Remove filter once entries removed correctly from ocurrences
		const entrySet = staffIds.map(id => staffMap[id]).filter(Boolean)
		entrySet.sort(staffSortByLabel)
		return entrySet
	}, [staffMap])

	const onSendAlert = () => {
		sendOccurrenceAlert(
			activeOccurrence.occurrenceId,
			activeOccurrence.vehicleAssignmentMap
		)
	}

	const onDelete = () => {
		deleteActiveOccurrence$.next(internalId)
		onClose()
	}
	
	const [showCreateOccurrence, setShowCreateOccurrence] = useState(false)
		
	return <div className='absolute top-0 left-0 flex flex-col w-full h-full z-10 select-none bg-background text-primary pb-5'>
		<Header className='bg-backgroundEmphasis mb-5'>
			<HeaderSection>
				<Button onClick={onClose}>Voltar atrás</Button>
			</HeaderSection>

			<HeaderSection>
				<Button onClick={onSendAlert}>Enviar alerta</Button>
				<Button onClick={setShowCreateOccurrence.bind(null, true)}>Alterar recursos</Button>
				<Button onClick={onDelete}>Fechar ocorrência</Button>
			</HeaderSection>
		</Header>

		<div className='flex flex-row justify-between px-5'>
			<div className='text-2xl font-extrabold'>
				Gerir ocorrência - {occurrence.name}
			</div>
		</div>

		<Scrollable className='px-5'>
			<h2 className='px-5 my-5 text-actionHighlight font-extrabold text-2xl'>
				Veículos
			</h2>

			<CardGrid small>
				{sortedVehicles.map(vehicle => (
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

			<h2 className='px-5 my-5 text-actionHighlight font-extrabold text-2xl'>
				Pessoal
			</h2>

			<CardGrid small>
				{sortedStaff.map(staff => (
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

		{showCreateOccurrence && <Modal>
			<ActiveOccurrenceWizard
				internalId={internalId}
				onClose={setShowCreateOccurrence.bind(null, false)}
			/>
		</Modal>}
	</div>
}
