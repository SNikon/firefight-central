import { FocusEventHandler, type FunctionComponent } from 'react'
import classNames from 'classnames'
import { StaffRank, type StaffState } from '../../_consts/native'
import { defaultToNbSp } from '../../_utils/defaultToNbsp'
import { getTagClassForStates } from '../../_utils/tagStyle'
import { staffStateToShortLocale } from '../../_utils/staffStateToLocale'
import { staffRankToInsignia } from '../../_utils/staffRankToInsignia'
import { useLanguageStore } from '../../_state/lang'

type StaffTagProps = {
  disabled?: boolean
  index: number
  internalId: string
  label: string
  onClick?: (internalId: string) => void
  rank: StaffRank
  selected?: boolean
  state: StaffState
}

export const StaffTag: FunctionComponent<StaffTagProps> = (props) => {
	const { languageData } = useLanguageStore()

	const onLocalClick = () => props.onClick?.(props.internalId)

	const stateClassName = classNames(
		'rounded-r-3xl flex-1 px-2 py-1 truncate',
		getTagClassForStates(props.state, props.selected || false)
	)

	const onFocus: FocusEventHandler<HTMLDivElement> = (evt) => {
		evt.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
	}

	return (
		<div
			className="w-full text-lg font-bold flex flex-row"
			onClick={props.disabled ? undefined : onLocalClick}
			onFocus={onFocus}
		>
			<div className="bg-button rounded-l-3xl w-24 h-9 px-2 py-1 flex flex-row justify-between">
				{props.rank && <img className="h-full object-cover mx-2" src={staffRankToInsignia(props.rank)} />}

				<label className="flex-1 text-primary truncate text-right">{defaultToNbSp(props.label)}</label>
			</div>

			<label className={stateClassName}>{defaultToNbSp(staffStateToShortLocale(props.state, languageData))}</label>
		</div>
	)
}
