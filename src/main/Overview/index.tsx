import { Button } from "../../_components/Button"
import { CardGrid } from "../../_components/CardGrid"
import { VehicleCard } from "../../_components/VehicleCard"
import { TableHeader } from "../_components/TableHeader"
import { Scrollable } from "../../_components/Scrollable"
import { ActiveOccurrenceCard } from "../../_components/ActiveOccurrenceCard"
import { useObservable } from "react-use"
import { activeOccurrences$, staff$, vehicles$ } from "../../_state/store"
import { useMemo, useState } from "react"
import { StaffCard } from "../../_components/StaffCard"
import { Modal } from "../../_components/Modal"
import { CreateActiveOccurrence } from "./CreateActiveOccurrence"
import { vehicleSortByOverviewState } from "../../_utils/vehicleSort"
import { staffSortByOverviewState } from "../../_utils/staffSort"
import { OccurrencePanel } from "../_components/OccurrencePanel"
import { StaffState, VehicleState } from "../../_consts/native"
import { StaffPanel } from "../_components/StaffPanel"
import { VehiclePanel } from "../_components/VehiclePanel"

export const Overview = () => {
	const activeOccurrenceMap = useObservable(activeOccurrences$, {})
	const vehicleMap = useObservable(vehicles$, {})
	const staffMap = useObservable(staff$, {})

	const sortedOccurrences = useMemo(() => {
		const entrySet = Object.values(activeOccurrenceMap)
		return entrySet
	}, [activeOccurrenceMap])

	const sortedVehicles = useMemo(() => {
		const entrySet = Object.values(vehicleMap)
		entrySet.sort(vehicleSortByOverviewState)
		return entrySet
	}, [vehicleMap])

	const sortedStaff = useMemo(() => {
		const entrySet = Object.values(staffMap)
		entrySet.sort(staffSortByOverviewState)
		return entrySet
	}, [staffMap])

	const [selectedId, setSelectedId] = useState<string>('')

	const [showCreateOccurrence, setShowCreateOccurrence] = useState(false)
	const [showViewOccurrence, setShowViewOccurrence] = useState(false)
	const [showViewStaff, setShowViewStaff] = useState(false)
	const [showViewVehicle, setShowViewVehicle] = useState(false)

	const onClosePanel = (setter: (inValue: boolean) => void) => {
		setSelectedId('')
		setter(false)
	}

	const onOccurrenceClick = (id: string) => {
		setSelectedId(id)
		setShowViewOccurrence(true)
	}

	const onStaffClick = (id: string) => {
		const staff = staffMap[id]!
		
		const isDispatched = staff.state === StaffState.Dispatched
		if (isDispatched) {
			const occurrenceId = sortedOccurrences.find(occurrence => occurrence.staffIds.includes(id))?.internalId
			
			if (occurrenceId) {
				setSelectedId(occurrenceId)
				setShowViewOccurrence(true)
				return
			}
		}

		setSelectedId(id)
		setShowViewStaff(true)	
	}

	const onVehicleClick = (id: string) => {
		const vehicle = vehicleMap[id]!
		
		const isDispatched = vehicle.state === VehicleState.Dispatched
		if (isDispatched) {
			const occurrenceId = sortedOccurrences.find(occurrence => occurrence.vehicleIds.includes(id))?.internalId
			
			if (occurrenceId) {
				setSelectedId(occurrenceId)
				setShowViewOccurrence(true)
				return
			}
		}

		setSelectedId(id)
		setShowViewVehicle(true)	
	}
	
	return (
		<div className="bg-body-background text-body-text flex flex-col overflow-hidden">	
			<TableHeader>
				<Button onClick={setShowCreateOccurrence.bind(null, true)}>Nova Ocorrência</Button>
			</TableHeader>

			<Scrollable className="pb-10">
				<div className="px-5 grid grid-flow-col gap-5 justify-start">
					{sortedOccurrences.map(occurrence => (
						<ActiveOccurrenceCard
							key={occurrence.internalId}
							internalId={occurrence.internalId}
							occurrenceId={occurrence.occurrenceId}
							staffIds={occurrence.staffIds}
							vehicleIds={occurrence.vehicleIds}
							onClick={onOccurrenceClick}
						/>
					))}
				</div>
				
				<h2 className="px-5 my-5 text-actionHighlight font-extrabold text-2xl">
					Veículos
				</h2>

				<CardGrid small>
					{sortedVehicles.map(vehicle => (
						<VehicleCard
							key={vehicle.internalId}
							label={vehicle.label}
							image={vehicle.image}
							internalId={vehicle.internalId}
							onClick={onVehicleClick}
							state={vehicle.state}
						/>
					))}
				</CardGrid>
			
				<h2 className="px-5 my-5 text-actionHighlight font-extrabold text-2xl">
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
							onClick={onStaffClick}
							state={staff.state}
						/>
					))}
				</CardGrid>
			</Scrollable>
					
			{showCreateOccurrence && <Modal><CreateActiveOccurrence onClose={setShowCreateOccurrence.bind(null, false)} /></Modal>}
			{showViewOccurrence && <Modal><OccurrencePanel internalId={selectedId} onClose={onClosePanel.bind(null, setShowViewOccurrence)} /></Modal>}
			{showViewStaff && <Modal><StaffPanel internalId={selectedId} onClose={onClosePanel.bind(null, setShowViewStaff)} /></Modal>}
			{showViewVehicle && <Modal><VehiclePanel internalId={selectedId} onClose={onClosePanel.bind(null, setShowViewVehicle)} /></Modal>}
		</div>
	)
}
