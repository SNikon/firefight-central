import { FocusEventHandler, type FunctionComponent } from 'react'
import { type TeamState } from '../../_consts/native'
import check from '../../_assets/check-solid.svg'
import { getCardClassForStates } from '../../_utils/cardStyle'

type TeamCardProps = {
	disabled?: boolean
	internalId: string
	label: string
	onClick?: (internalId: string) => void
	selected?: boolean
	state: TeamState
}

export const TeamCard: FunctionComponent<TeamCardProps> = props => {
	const className = getCardClassForStates(props.state, props.selected || false)

	const clickHandler = (props.disabled || !props.onClick)
		? undefined
		: props.onClick.bind(null, props.internalId)

	const onFocus: FocusEventHandler<HTMLButtonElement> = evt => {
		evt.target.scrollIntoView({ behavior: 'smooth', block: 'nearest'})
	}

	return (
		<div className="w-full max-w-full h-full max-h-full overflow-visible aspect-video">
			<button disabled={props.disabled} className={className} onClick={clickHandler} onFocus={onFocus}>
				<div className='rounded relative flex flex-1 flex-col w-full h-full overflow-hidden justify-center items-center'>
					<div className='absolute flex flex-col justify-between w-full h-full pointer-events-none'>
						<label className='w-full p-2 flex items-center justify-center bg-gradient-to-b from-[#000]/90 to-[#000]/30 text-ellipsis whitespace-nowrap truncate'>
							{props.label || <span>&nbsp;</span>}
						</label>
					</div>
				</div>

				{props.selected && (
					<div className='absolute right-0 top-0 rounded-bl-full bg-primary w-10 h-10 flex justify-center items-center'>
						<img className='ml-2 mb-1 w-5 h-5' src={check} />
					</div>
				)}
			</button>
		</div>
	)
}
