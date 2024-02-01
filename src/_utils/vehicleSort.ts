import { Vehicle, VehicleState } from "../_consts/native"

export const vehicleSortByLabel = (a: Vehicle, b: Vehicle) => {
	const aNumber = Number.parseInt(a.label, 10)
	const bNumber = Number.parseInt(b.label, 10)
	
	if (Number.isNaN(aNumber) && Number.isNaN(bNumber)) return a.label.localeCompare(b.label)
	if (Number.isNaN(aNumber)) return 1
	if (Number.isNaN(bNumber)) return -1
	return aNumber - bNumber
}

const vehicleStateSortForOverview = Object.fromEntries([VehicleState.Dispatched, VehicleState.Available, VehicleState.Unavailable].map((state, index) => [state, index]))
export const vehicleSortByOverviewState = (a: Vehicle, b: Vehicle) => {
	const stateRef = vehicleStateSortForOverview[a.state] - vehicleStateSortForOverview[b.state]
	if (stateRef !== 0) return stateRef
	const aNumber = Number.parseInt(a.label, 10)
	const bNumber = Number.parseInt(b.label, 10)
	
	if (Number.isNaN(aNumber) && Number.isNaN(bNumber)) return a.label.localeCompare(b.label)
	if (Number.isNaN(aNumber)) return 1
	if (Number.isNaN(bNumber)) return -1
	return aNumber - bNumber
}

const vehicleStateSortForOccurrence = Object.fromEntries([VehicleState.Available, VehicleState.Dispatched, VehicleState.Unavailable].map((state, index) => [state, index]))
export const vehicleSortByOcurrenceState = (a: Vehicle, b: Vehicle) => {
	const stateRef = vehicleStateSortForOccurrence[a.state] - vehicleStateSortForOccurrence[b.state]
	if (stateRef !== 0) return stateRef
	const aNumber = Number.parseInt(a.label, 10)
	const bNumber = Number.parseInt(b.label, 10)
	
	if (Number.isNaN(aNumber) && Number.isNaN(bNumber)) return a.label.localeCompare(b.label)
	if (Number.isNaN(aNumber)) return 1
	if (Number.isNaN(bNumber)) return -1
	return aNumber - bNumber
}