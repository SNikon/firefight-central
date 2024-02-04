import { FocusEventHandler, type FunctionComponent } from 'react'
import classNames from 'classnames'
import { VehicleState } from '../../_consts/native'
import { defaultToNbSp } from '../../_utils/defaultToNbsp'
import { getTagClassForStates } from '../../_utils/tagStyle'
import { vehicleStateToShortLocale } from '../../_utils/vehicleStateToLocale'

type VehicleTagProps = {
	index: number
	internalId: string
	label: string
	selected?: boolean
	state: VehicleState
}

export const VehicleTag: FunctionComponent<VehicleTagProps> = props => {
	const stateClassName = classNames(
		'rounded-r-3xl flex-1 px-2 py-1 truncate',
		getTagClassForStates(props.state, props.selected || false))

	const onFocus: FocusEventHandler<HTMLDivElement> = evt => {
		evt.target.scrollIntoView({ behavior: 'smooth', block: 'nearest'})
	}

	return (
		<div className='w-full text-lg font-bold flex flex-row' onFocus={onFocus}>
			<label className='bg-button text-primary rounded-l-3xl w-24 px-2 py-1 truncate text-right'>
				{defaultToNbSp(props.label)}
			</label>

			<label className={stateClassName}>
				{defaultToNbSp(vehicleStateToShortLocale(props.state))}
			</label>
		</div>
	)
}
