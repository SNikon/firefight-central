import classNames from 'classnames'
import { StaffState, VehicleState } from '../_consts/native'

const selectedClass = 'bg-primary text-primary'
const availableClass = 'bg-available text-primary'
const dispatchedClass = 'bg-dispatched text-primary'
const unavailableClass = 'bg-unavailable text-primary'

export const getTagClassForStates = <T extends VehicleState | StaffState | void>(state: T, isSelected: boolean): string => {
	if (isSelected) {
		return selectedClass
	}

	return classNames({
		[availableClass]: state === VehicleState.Available || state === StaffState.Available,
		[dispatchedClass]: state === VehicleState.Dispatched || state === StaffState.Dispatched,
		[unavailableClass]: state === VehicleState.Unavailable || state === StaffState.Unavailable
	})
}
