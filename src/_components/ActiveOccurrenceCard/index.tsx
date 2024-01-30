import { FunctionComponent } from "react"
import { occurrences$, staff$, vehicles$ } from "../../_state/store"
import { useObservable } from "react-use"

interface ActiveOccurrenceCardProps {
	internalId: string
	occurrenceId: string
	onClick: (internalId: string) => void
	staffIds: string[]
	vehicleIds: string[]
}

export const ActiveOccurrenceCard: FunctionComponent<ActiveOccurrenceCardProps> = ({
	internalId,
	occurrenceId,
	onClick,
	staffIds,
	vehicleIds
}) => {
	const occurrences = useObservable(occurrences$, {})
		
	const occurrence = occurrences[occurrenceId]?.name
	const vehicleCount = vehicleIds.length
	const staffCount = staffIds.length

	const clickHandler = !onClick
		? undefined
		: onClick.bind(null, internalId)

	return (
		<div className="w-full max-w-max h-full max-h-full overflow-visible">
			<button className="animate-tinyPing bg-button text-primary w-full min-h-28 max-h-full uppercase text-xl font-extrabold p-2 rounded relative" onClick={clickHandler}>
				<div className="rounded relative flex flex-col overflow-hidden justify-center items-center">
					<div className="flex flex-col justify-center w-full h-full">
						<label className="w-full p-2 flex items-center justify-center bg-gradient-to-b from-[#000]/90 to-[#000]/30 whitespace-nowrap">
							{occurrence}
						</label>

						<div className="w-full p-2 flex items-center justify-start text-left">
							Bombeiros: {staffCount}
						</div>

						<div className="w-full p-2 flex items-center justify-start text-left">
							Veículos: {vehicleCount}
						</div>
					</div>
				</div>
			</button>
		</div>
	)
}