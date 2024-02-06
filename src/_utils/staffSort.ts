import { type Staff, StaffState } from '../_consts/native'

export const staffSortByLabel = (a: Staff, b: Staff) => {
	const aNumber = Number.parseInt(a.label, 10)
	const bNumber = Number.parseInt(b.label, 10)

	if (Number.isNaN(aNumber) && Number.isNaN(bNumber)) {
		return a.label.localeCompare(b.label)
	}

	if (Number.isNaN(aNumber)) {
		return 1
	}

	if (Number.isNaN(bNumber)) {
		return -1
	}

	return aNumber - bNumber
}

const staffSortByState = (a: Staff, b: Staff, stateOrder: Partial<Record<StaffState, number>>) => {
	const aStateRef = stateOrder[a.state]
	const bStateRef = stateOrder[b.state]
	if (aStateRef === bStateRef) {
		return 0
	}
	
	if (bStateRef === undefined) { return -1 }
	if (aStateRef === undefined) { return 1 }
	
	return aStateRef - bStateRef
}

const staffStateSortForOverview: Partial<Record<StaffState, number>> =
	Object.fromEntries([StaffState.Dispatched, StaffState.Available].map((state, index) => [state, index]))
export const staffSortByOverviewState = (a: Staff, b: Staff) => {
	const stateRef = staffSortByState(a, b, staffStateSortForOverview)

	return stateRef !== 0
		? stateRef
		: staffSortByLabel(a, b)
}

const staffStateSortForOccurrence: Partial<Record<StaffState, number>> =
	Object.fromEntries([StaffState.Available, StaffState.Dispatched].map((state, index) => [state, index]))
export const staffSortByOccurrenceState = (a: Staff, b: Staff) => {
	const stateRef = staffSortByState(a, b, staffStateSortForOccurrence)
	
	return stateRef !== 0
		? stateRef
		: staffSortByLabel(a, b)
}
