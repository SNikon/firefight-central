import { FocusEventHandler, type FunctionComponent } from 'react'
import classNames from 'classnames'
import { type StaffState } from '../../_consts/native'
import { defaultToNbSp } from '../../_utils/defaultToNbsp'
import { getTagClassForStates } from '../../_utils/tagStyle'
import { staffStateToShortLocale } from '../../_utils/staffStateToLocale'

type StaffTagProps = {
	index: number
	internalId: string
	label: string
	selected?: boolean
	state: StaffState
}

export const StaffTag: FunctionComponent<StaffTagProps> = props => {
	const stateClassName = classNames(
		'rounded-r-3xl flex-1 px-2 py-1 truncate',
		getTagClassForStates(props.state, props.selected || false))

	const onFocus: FocusEventHandler<HTMLDivElement> = evt => {
		evt.target.scrollIntoView({ behavior: 'smooth', block: 'nearest'})
	}

	return (
		<div className='w-full text-lg font-bold flex flex-row' onFocus={onFocus}>
			<label className='bg-button text-primary rounded-l-3xl w-16 px-2 py-1 truncate text-right'>
				{defaultToNbSp(props.label)}
			</label>

			<label className={stateClassName}>
				{defaultToNbSp(staffStateToShortLocale(props.state))}
			</label>
		</div>
	)
}
