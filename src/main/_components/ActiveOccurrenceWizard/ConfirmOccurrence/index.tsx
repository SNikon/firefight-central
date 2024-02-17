import { type FunctionComponent } from 'react'
import { useObservable } from 'react-use'
import { Header, HeaderSection } from '../../../../_components/Header'
import { Button } from '../../../../_components/Button'
import { occurrences$ } from '../../../../_state/store'
import { ActiveOccurrence, Staff, StaffState, Vehicle, VehicleState } from '../../../../_consts/native'
import { sendAlert } from '../../../../_utils/sendAlert'

type ConfirmOccurrenceProps = {
	activeOccurrence?: ActiveOccurrence
	allowAlert: boolean
	occurrenceId: string
	onCancel: () => void
	onNext: () => void
	onPrevious: () => void
	vehicleIds: string[]
	vehicles: Record<string, Vehicle>
	staff: Record<string, Staff>
	staffIds: string[]
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
	vehicleIds,
	vehicles,
}) => {
	const occurrences = useObservable(occurrences$, {})
	const occurrence = occurrences[occurrenceId]?.name

	const onSendAlert = () => {
		const vehicleSet = vehicleIds.map(id => vehicles[id]?.label)
		const staffSet = staffIds.map(id => staff[id]?.label)
	
		sendAlert(occurrence, staffSet, vehicleSet)
		onNext()
	}
	// If there is a vehicle or staff that is not available and not in the active occurrence, add a warning
	const unavailableStaff = staffIds.filter(staffId => staff[staffId].state !== StaffState.Available && !activeOccurrence?.staffIds.includes(staffId))
	const hasUnavailableStaff = unavailableStaff.length > 0
	const unavailableVehicles = vehicleIds.filter(vehicleId => vehicles[vehicleId].state !== VehicleState.Available && !activeOccurrence?.vehicleIds.includes(vehicleId))
	const hasUnavailableVehicles = unavailableVehicles.length > 0

	return (
		<div className='w-full text-action flex flex-col overflow-hidden'>
			<Header className="px-0 pt-0 mb-5">
				<HeaderSection>
					<Button onClick={onCancel}>Cancelar</Button>
				</HeaderSection>
				
				<HeaderSection>
					{onPrevious && <Button onClick={onPrevious}>Voltar</Button>}
					<Button onClick={onNext}>Confirmar</Button>
					{allowAlert && <Button onClick={onSendAlert}>Confirmar e enviar Alerta</Button>}
				</HeaderSection>
			</Header>

			<p>Tipo de Ocorrência: {occurrence}</p>

			<p>
				Veículos:&nbsp;
				{vehicleIds.map((vehicleId, idx) => <>
					<span className={unavailableVehicles.includes(vehicleId) ? 'text-warning': ''}>
						{vehicles[vehicleId]?.label}
					</span>
					{idx < vehicleIds.length - 1 ? ', ': ''}
				</>)}
			</p>
			
			{hasUnavailableVehicles &&
				<p className='text-warning'>
					Um ou mais veículos selecionados não estão operacionais ou encontram-se noutra ocorrência
				</p>}

			<p>
				Equipa:&nbsp;
				{staffIds.map((staffId, idx) => <>
					<span className={unavailableStaff.includes(staffId) ? 'text-warning': ''}>
						{staff[staffId]?.label}
					</span>
					{idx < staffIds.length - 1 ? ', ': ''}
				</>)}
			</p>

			{hasUnavailableStaff &&
				<p className='text-warning'>
					Um ou mais bombeiros selecionados não estão disponíveis ou encontram-se noutra ocorrência
				</p>}
		</div>
	)
}
