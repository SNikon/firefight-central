import { useObservable } from 'react-use'
import { useMemo, useState } from 'react'
import { Button } from '../../_components/Button'
import { CardGrid } from '../../_components/CardGrid'
import { VehicleCard } from '../../_components/VehicleCard'
import { TableHeader } from '../_components/TableHeader'
import { vehicles$ } from '../../_state/store'
import { Modal } from '../../_components/Modal'
import { Scrollable } from '../../_components/Scrollable'
import { vehicleSortByLabel } from '../../_utils/vehicleSort'
import { VehiclePanel } from '../_components/VehiclePanel'

export const ManageVehicles = () => {
	const vehicleMap = useObservable(vehicles$, {})
	const vehicles = useMemo(() => {
		const entries = Object.values(vehicleMap)
		entries.sort(vehicleSortByLabel)
		return entries
	}, [vehicleMap])

	const [selectedId, setSelectedId] = useState<string | undefined>(null)
	const [showForm, setShowForm] = useState(false)
	const closeForm = setShowForm.bind(null, false)

	const onCreate = () => {
		setSelectedId(null)
		setShowForm(true)
	}

	const onVehicleClick = (id: string) => {
		setSelectedId(id)
		setShowForm(true)
	}

	return (
		<div className='bg-body-background text-body-text flex flex-1 flex-col overflow-hidden select-none'>
			<TableHeader>
				<Button onClick={onCreate}>Novo veículo</Button>
			</TableHeader>

			<Scrollable className='pb-10'>
				<CardGrid>
					{vehicles.map(vehicle => (
						<VehicleCard
							key={vehicle.internalId}
							label={vehicle.label}
							internalId={vehicle.internalId}
							image={vehicle.image}
							onClick={onVehicleClick}
							state={vehicle.state}
						/>
					))}
				</CardGrid>
			</Scrollable>

			{showForm && <Modal><VehiclePanel internalId={selectedId} onClose={closeForm} /></Modal>}
		</div>
	)
}
