import { FocusEventHandler, type FunctionComponent } from 'react'
import classNames from 'classnames'
import { type StaffState } from '../../_consts/native'
import { staffStateToLocale } from '../../_utils/staffStateToLocale'
import staffSample from '../../_assets/staff_sample.jpg'
import check from '../../_assets/check-solid.svg'
import { getCardClassForStates } from '../../_utils/cardStyle'
import { shortenName } from '../../_utils/shortenName'
import { defaultToNbSp } from '../../_utils/defaultToNbsp'
import { useLanguageStore } from '../../_state/lang'

type StaffCardProps = {
  disabled?: boolean
  image?: string
  internalId: string
  label: string
  name: string
  onClick?: (internalId: string) => void
  selected?: boolean
  small?: boolean
  state: StaffState
}

export const StaffCard: FunctionComponent<StaffCardProps> = (props) => {
	const { languageData } = useLanguageStore()

	const containerClassName = classNames('w-full max-w-full h-full max-h-full overflow-visible', {
		'aspect-video': props.small
	})
	const buttonClassName = getCardClassForStates(props.state, props.selected || false)

	const clickHandler = props.disabled || !props.onClick ? undefined : props.onClick.bind(null, props.internalId)
	const imgSource = props.image?.trim() || staffSample

	const onFocus: FocusEventHandler<HTMLButtonElement> = (evt) => {
		evt.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
	}

	return (
		<div className={containerClassName}>
			<button disabled={props.disabled} className={buttonClassName} onClick={clickHandler} onFocus={onFocus}>
				<div className="rounded relative flex flex-1 flex-col w-full h-full overflow-hidden justify-center items-center">
					{!props.small && (
						<div className="flex flex-col align-middle justify-center overflow-hidden rounded">
							<img className="w-100 object-contain" src={imgSource} />
						</div>
					)}

					<div className="absolute flex flex-col justify-between w-full h-full pointer-events-none">
						<div className="w-full p-2 flex flex-col items-center justify-center bg-gradient-to-b from-[#000]/90 to-[#000]/30">
							<label className="text-ellipsis whitespace-nowrap truncate">{defaultToNbSp(props.label)}</label>

							{!props.small && (
								<label className="text-ellipsis whitespace-nowrap truncate">{defaultToNbSp(props.name)}</label>
							)}
						</div>

						<div className="w-full p-2 flex items-center justify-center bg-gradient-to-t from-[#000]/90 to-[#000]/30 text-ellipsis whitespace-nowrap truncate">
							{defaultToNbSp(props.small ? shortenName(props.name) : staffStateToLocale(props.state, languageData))}
						</div>
					</div>
				</div>

				{props.selected && (
					<div className="absolute right-0 top-0 rounded-bl-full bg-primary w-10 h-10 flex justify-center items-center">
						<img className="ml-2 mb-1 w-5 h-5" src={check} />
					</div>
				)}
			</button>
		</div>
	)
}
