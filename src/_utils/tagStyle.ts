import classNames from 'classnames'
import { StaffState, VehicleState } from '../_consts/native'

const availableTypes = [VehicleState.Available, StaffState.Available]
const dispatchedTypes = [VehicleState.Dispatched, StaffState.Dispatched]
const unavailableTypes = [VehicleState.Unavailable, StaffState.Unavailable, StaffState.Inactive, StaffState.SickLeave]

export const getTagClassForStates = <T extends VehicleState | StaffState | void>(state: T, isSelected: boolean): string =>
	classNames({
		'bg-primary': isSelected,
		'bg-available': !isSelected && state && availableTypes.includes(state),
		'bg-dispatched': !isSelected && state && dispatchedTypes.includes(state),
		'bg-unavailable': !isSelected && state && unavailableTypes.includes(state),
		
		'text-primary': !isSelected,
		'text-available': isSelected && state && availableTypes.includes(state),
		'text-dispatched': isSelected && state && dispatchedTypes.includes(state),
		'text-unavailable': isSelected && state && unavailableTypes.includes(state)
	})
