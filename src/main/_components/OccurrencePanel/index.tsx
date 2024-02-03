import { type FunctionComponent, useMemo } from 'react'
import { useObservable } from 'react-use'
import { activeOccurrences$, deleteActiveOccurrence$, occurrences$, staff$, vehicles$ } from '../../../_state/store'
import { Button } from '../../../_components/Button'
import { Scrollable } from '../../../_components/Scrollable'
import { staffSortByLabel } from '../../../_utils/staffSort'
import { vehicleSortByLabel } from '../../../_utils/vehicleSort'
import { CardGrid } from '../../../_components/CardGrid'
import { VehicleCard } from '../../../_components/VehicleCard'
import { StaffCard } from '../../../_components/StaffCard'

type OccurrencePanelProps = {
	internalId: string;
	onClose: () => void;
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
		const entrySet = vehicleIds.map(id => vehicleMap[id])
		entrySet.sort(vehicleSortByLabel)
		return entrySet
	}, [vehicleMap])

	const sortedStaff = useMemo(() => {
		const entrySet = staffIds.map(id => staffMap[id])
		entrySet.sort(staffSortByLabel)
		return entrySet
	}, [staffMap])

	const onDelete = () => {
		deleteActiveOccurrence$.next(internalId)
		onClose()
	}

	const onAdd = () => {
		// TODO
	}

	const onRemove = () => {
		// TODO
	}

	return <div className='absolute top-0 left-0 flex flex-col w-full h-full z-10 select-none bg-[#000] text-primary p-5'>
		<div className='flex flex-row justify-between'>
			<div className='text-2xl font-extrabold'>
				Gerir ocorrência - {occurrence.name}
			</div>
		</div>

		<Scrollable>
			<h2 className='px-5 my-5 text-actionHighlight font-extrabold text-2xl'>
				Veículos
			</h2>

			<CardGrid small>
				{sortedVehicles.map(vehicle => (
					<VehicleCard
						key={vehicle.internalId}
						disabled
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
						disabled
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

		<div className='space-x-5 pt-5'>
			<Button onClick={onClose}>Voltar atrás</Button>
			<Button onClick={onAdd}>Adicionar recursos</Button>
			<Button onClick={onRemove}>Remover recursos</Button>
			<Button onClick={onDelete}>Fechar ocorrência</Button>
		</div>
	</div>
}
