import { FunctionComponent } from "react"
import { VehicleState } from "../../_consts/native"
import classNames from "classnames"
import { vehicleStateToLocale } from "../../_utils/vehicleStateToLocale"
import vehicleSample from '../../_assets/vehicle_sample.jpg'
import check from '../../_assets/check-solid.svg'

interface VehicleCardProps {
	disabled?: boolean
	id: string
	image?: string
	onClick?: () => void
	selected?: boolean
	state: VehicleState
}

const containerClass = "w-full mim-h-28 max-h-full uppercase text-xl font-extrabold p-2 rounded relative"
const selectedClass = "bg-primary text-primary"
const defaultClass = "bg-button text-primary"

export const VehicleCard: FunctionComponent<VehicleCardProps> = props => {
	const stateClass = props.selected ? selectedClass : defaultClass
	const className = classNames(containerClass, stateClass)

	const clickHandler = props.disabled ? undefined : props.onClick
	const imgSource = props.image?.trim() || vehicleSample

	return (
		<button className={className} onClick={clickHandler}>
			<div className="rounded relative flex flex-col overflow-hidden justify-center items-center">
				<div className="flex flex-col align-middle justify-center overflow-hidden rounded">					
					<img className="max-h-fit object-contain" src={imgSource} />
				</div>

				<div className="absolute flex flex-col justify-between w-full h-full">
					<label className="w-full p-2 flex items-center justify-center bg-gradient-to-b from-[#000]/90 to-[#000]/30">
						{props.id}
					</label>

					<text className="w-full p-2 flex items-center justify-center bg-gradient-to-t from-[#000]/90 to-[#000]/30">
						{vehicleStateToLocale(props.state)}
					</text>
				</div>
			</div>

			{props.selected && (
				<div className="absolute right-0 top-0 rounded-bl-full bg-primary w-10 h-10 flex justify-center items-center">
					<img className="ml-2 mb-1 w-5 h-5" src={check} />
				</div>
			)}
		</button>
	)
}