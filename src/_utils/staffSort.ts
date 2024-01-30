import { Staff, StaffState } from "../_consts/native"

export const staffSortByLabel = (a: Staff, b: Staff) => {
	const aNumber = Number.parseInt(a.label, 10)
	const bNumber = Number.parseInt(b.label, 10)
	
	if (Number.isNaN(aNumber) && Number.isNaN(bNumber)) return a.label.localeCompare(b.label)
	if (Number.isNaN(aNumber)) return 1
	if (Number.isNaN(bNumber)) return -1
	return aNumber - bNumber
}

const staffStateSortForOverview = Object.fromEntries([StaffState.Dispatched, StaffState.Available, StaffState.Unavailable].map((state, index) => [state, index]))
export const staffSortByOverviewState = (a: Staff, b: Staff) => {
	const stateRef = staffStateSortForOverview[a.state] - staffStateSortForOverview[b.state]
	if (stateRef !== 0) return stateRef
	const aNumber = Number.parseInt(a.label, 10)
	const bNumber = Number.parseInt(b.label, 10)
	
	if (Number.isNaN(aNumber) && Number.isNaN(bNumber)) return a.label.localeCompare(b.label)
	if (Number.isNaN(aNumber)) return 1
	if (Number.isNaN(bNumber)) return -1
	return aNumber - bNumber
}

const staffStateSortForOccurrence = Object.fromEntries([StaffState.Available, StaffState.Dispatched, StaffState.Unavailable].map((state, index) => [state, index]))
export const staffSortByOccurrenceState = (a: Staff, b: Staff) => {
	const stateRef = staffStateSortForOccurrence[a.state] - staffStateSortForOccurrence[b.state]
	if (stateRef !== 0) return stateRef
	const aNumber = Number.parseInt(a.label, 10)
	const bNumber = Number.parseInt(b.label, 10)
	
	if (Number.isNaN(aNumber) && Number.isNaN(bNumber)) return a.label.localeCompare(b.label)
	if (Number.isNaN(aNumber)) return 1
	if (Number.isNaN(bNumber)) return -1
	return aNumber - bNumber
}