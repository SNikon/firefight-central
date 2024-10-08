import { FocusEventHandler, type FunctionComponent } from 'react'
import classNames from 'classnames'
import { type VehicleState } from '../../_consts/native'
import { vehicleStateToLocale } from '../../_utils/vehicleStateToLocale'
import vehicleSample from '../../_assets/vehicle_sample.jpg'
import check from '../../_assets/check-solid.svg'
import { getCardClassForStates } from '../../_utils/cardStyle'
import { useLanguageStore } from '../../_state/lang'

type VehicleCardProps = {
  disabled?: boolean
  internalId: string
  image?: string
  label: string
  onClick?: (internalId: string) => void
  selected?: boolean
  small?: boolean
  state: VehicleState
}

export const VehicleCard: FunctionComponent<VehicleCardProps> = (props) => {
	const { languageData } = useLanguageStore()

	const containerClassName = classNames('w-full max-w-full h-full max-h-full overflow-visible', {
		'aspect-video': props.small
	})
	const className = getCardClassForStates(props.state, props.selected || false)

	const clickHandler = props.disabled || !props.onClick ? undefined : props.onClick.bind(null, props.internalId)
	const imgSource = props.image?.trim() || vehicleSample

	const onFocus: FocusEventHandler<HTMLButtonElement> = (evt) => {
		evt.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
	}

	return (
		<div className={containerClassName}>
			<button disabled={props.disabled} className={className} onClick={clickHandler} onFocus={onFocus}>
				<div className="rounded relative flex flex-1 flex-col w-full h-full overflow-hidden justify-center items-center">
					{!props.small && (
						<div className="flex flex-col align-middle justify-center overflow-hidden rounded">
							<img className="w-100 object-contain" src={imgSource} />
						</div>
					)}

					<div className="absolute flex flex-col justify-between w-full h-full pointer-events-none">
						<label className="w-full p-2 flex items-center justify-center bg-gradient-to-b from-[#000]/90 to-[#000]/30 text-ellipsis whitespace-nowrap truncate">
							{props.label || <span>&nbsp;</span>}
						</label>

						{!props.small && (
							<div className="w-full p-2 flex items-center justify-center bg-gradient-to-t from-[#000]/90 to-[#000]/30 text-ellipsis whitespace-nowrap truncate">
								{vehicleStateToLocale(props.state, languageData)}
							</div>
						)}
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
