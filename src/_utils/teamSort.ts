import {type Team, TeamState } from '../_consts/native'

export const teamSortByLabel = (a: Team, b: Team) => {
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

const teamStateSortForOverview = Object.fromEntries([TeamState.Dispatched, TeamState.Available, TeamState.Unavailable].map((state, index) => [state, index]))
export const teamSortByOverviewState = (a: Team, b: Team) => {
	const stateRef = teamStateSortForOverview[a.state] - teamStateSortForOverview[b.state]
	if (stateRef !== 0) {
		return stateRef
	}

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

const teamStateSortForOccurrence = Object.fromEntries([TeamState.Available, TeamState.Dispatched, TeamState.Unavailable].map((state, index) => [state, index]))
export const teamSortByOcurrenceState = (a: Team, b: Team) => {
	const stateRef = teamStateSortForOccurrence[a.state] - teamStateSortForOccurrence[b.state]
	if (stateRef !== 0) {
		return stateRef
	}

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
