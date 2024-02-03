import classNames from 'classnames'
import { StaffState, VehicleState } from '../_consts/native'

const containerClass = 'w-full min-h-28 max-h-full uppercase text-xl font-extrabold p-2 rounded relative flex flex-col'
const selectedClass = 'animate-tinyPing bg-primary text-primary'
const defaultClass = 'bg-button text-primary'
const dispatchedClass = 'bg-dispatched'
const unavailableClass = 'bg-unavailable'

export const getCardClassForStates = <T extends VehicleState | StaffState | void>(state: T, isSelected: boolean): string => {
	if (isSelected) {
		return classNames(containerClass, selectedClass)
	}

	return classNames(containerClass, defaultClass, {
		[dispatchedClass]: state === VehicleState.Dispatched || state === StaffState.Dispatched,
		[unavailableClass]: state === VehicleState.Unavailable || state === StaffState.Unavailable
	})
}
